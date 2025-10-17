import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  data: any;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

@Injectable()
export class FlowService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async findAll(tenantId: string) {
    return this.prisma.flow.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const flow = await this.prisma.flow.findFirst({
      where: { id, tenantId },
    });

    if (!flow) {
      throw new HttpException('Flow not found', HttpStatus.NOT_FOUND);
    }

    return flow;
  }

  async create(data: any) {
    return this.prisma.flow.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        trigger: data.nodes?.[0]?.data?.triggerType || 'manual',
        nodes: data.nodes || [],
        edges: data.edges || [],
        status: data.status || 'DRAFT',
      },
    });
  }

  async update(id: string, data: any, tenantId: string) {
    const flow = await this.findOne(id, tenantId);

    return this.prisma.flow.update({
      where: { id: flow.id },
      data: {
        name: data.name,
        trigger: data.nodes?.[0]?.data?.triggerType || flow.trigger,
        nodes: data.nodes || [],
        edges: data.edges || [],
        status: data.status,
      },
    });
  }

  async delete(id: string, tenantId: string) {
    const flow = await this.findOne(id, tenantId);

    await this.prisma.flow.delete({
      where: { id: flow.id },
    });

    return { success: true };
  }

  /**
   * Execute a flow based on trigger data
   */
  async executeFlow(flowId: string, triggerData: any, tenantId: string) {
    const flow = await this.findOne(flowId, tenantId);

    if (flow.status !== 'ACTIVE') {
      throw new HttpException(
        'Flow is not active',
        HttpStatus.BAD_REQUEST,
      );
    }

    const nodes: FlowNode[] = (flow.nodes as any) || [];
    const edges: FlowEdge[] = (flow.edges as any) || [];

    // Find the trigger node (starting point)
    const triggerNode = nodes.find((node) => node.type === 'trigger');
    if (!triggerNode) {
      throw new HttpException(
        'Flow has no trigger node',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create FlowExecution record
    const execution = await this.prisma.flowExecution.create({
      data: {
        flowId,
        status: 'STARTED',
        input: triggerData,
      },
    });

    let executionStatus = 'COMPLETED';
    let executionError: string | null = null;

    try {
      // Execute the flow starting from trigger
      const context = {
        triggerData,
        tenantId,
        flowId,
        executionId: execution.id,
        variables: {},
      };

      const result = await this.executeNode(
        triggerNode,
        nodes,
        edges,
        context,
      );

      // Update execution with result
      await this.prisma.flowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'COMPLETED',
          output: result,
          completedAt: new Date(),
        },
      });

      // Log execution success
      await this.prisma.flow.update({
        where: { id: flowId },
        data: {
          totalRuns: { increment: 1 },
          successfulRuns: { increment: 1 },
        },
      });

      return {
        success: true,
        flowId,
        executionId: execution.id,
        result,
      };
    } catch (error) {
      executionStatus = 'FAILED';
      executionError = error.message || 'Unknown error';

      // Update execution with error
      await this.prisma.flowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          error: executionError,
          completedAt: new Date(),
        },
      });

      // Log execution failure
      await this.prisma.flow.update({
        where: { id: flowId },
        data: {
          totalRuns: { increment: 1 },
          failedRuns: { increment: 1 },
        },
      });

      throw error;
    }
  }

  /**
   * Execute a single node and follow its connections
   */
  private async executeNode(
    node: FlowNode,
    allNodes: FlowNode[],
    edges: FlowEdge[],
    context: any,
  ): Promise<any> {
    console.log(`Executing node: ${node.id} (${node.type})`);

    const startTime = Date.now();
    let result: any = null;
    let nodeStatus = 'SUCCESS';
    let nodeError: string | null = null;

    try {
      switch (node.type) {
        case 'trigger':
          result = context.triggerData;
          break;

        case 'action':
          result = await this.executeAction(node, context);
          break;

        case 'condition':
          result = await this.evaluateCondition(node, context);
          break;

        case 'delay':
          result = await this.executeDelay(node);
          break;

        default:
          console.warn(`Unknown node type: ${node.type}`);
          nodeStatus = 'SKIPPED';
      }
    } catch (error) {
      nodeStatus = 'FAILED';
      nodeError = error.message || 'Unknown error';
      console.error(`Node execution failed: ${node.id}`, error);
    }

    const durationMs = Date.now() - startTime;

    // Track node execution for analytics
    await this.prisma.flowNodeExecution.create({
      data: {
        executionId: context.executionId,
        nodeId: node.id,
        nodeType: node.type,
        status: nodeStatus,
        input: node.data || {},
        output: result,
        error: nodeError,
        durationMs,
        completedAt: new Date(),
      },
    });

    // If node failed, don't continue execution
    if (nodeStatus === 'FAILED') {
      throw new Error(`Node ${node.id} failed: ${nodeError}`);
    }

    // Find next nodes connected to this one
    const nextEdges = edges.filter((edge) => edge.source === node.id);

    for (const edge of nextEdges) {
      const nextNode = allNodes.find((n) => n.id === edge.target);
      if (nextNode) {
        // Update context with result
        context.variables[node.id] = result;
        await this.executeNode(nextNode, allNodes, edges, context);
      }
    }

    return result;
  }

  /**
   * Execute an action node (send message, reply to comment, etc.)
   */
  private async executeAction(node: FlowNode, context: any): Promise<any> {
    const actionType = node.data.actionType;

    switch (actionType) {
      case 'send_message':
        return this.sendMessage(node.data, context);

      case 'reply_comment':
        return this.replyToComment(node.data, context);

      case 'auto_reply':
        return this.sendAutoReply(node.data, context);

      case 'add_tag':
        return this.addTag(node.data, context);

      default:
        console.warn(`Unknown action type: ${actionType}`);
        return null;
    }
  }

  /**
   * Send a DM to user
   */
  private async sendMessage(actionData: any, context: any): Promise<any> {
    console.log('Sending message:', actionData.message);

    // TODO: Integrate with social media APIs
    // For now, create a message record
    const message = await this.prisma.message.create({
      data: {
        conversationId: context.triggerData.conversationId || 'demo-conversation',
        tenantId: context.tenantId,
        integrationId: context.triggerData.integrationId || 'demo-integration',
        platform: context.triggerData.platform || 'FACEBOOK',
        direction: 'OUTBOUND',
        status: 'SENT',
        type: 'TEXT',
        content: actionData.message || 'Auto-generated message',
        externalId: `flow-${Date.now()}`,
        senderId: 'bot',
        recipientId: context.triggerData.senderId || 'user',
        metadata: {
          flowId: context.flowId,
          automated: true,
        },
      },
    });

    return { success: true, messageId: message.id };
  }

  /**
   * Reply to a comment
   */
  private async replyToComment(actionData: any, context: any): Promise<any> {
    console.log('Replying to comment:', actionData.reply);

    // TODO: Use Facebook/Instagram API to reply to comment
    // For now, just log it
    return {
      success: true,
      reply: actionData.reply || 'Thank you for your comment!',
      commentId: context.triggerData.commentId,
    };
  }

  /**
   * Send auto-reply
   */
  private async sendAutoReply(actionData: any, context: any): Promise<any> {
    console.log('Sending auto-reply:', actionData.text);

    return {
      success: true,
      text: actionData.text || 'Thanks for reaching out!',
    };
  }

  /**
   * Add tag to user
   */
  private async addTag(actionData: any, context: any): Promise<any> {
    console.log('Adding tag:', actionData.tag);

    return {
      success: true,
      tag: actionData.tag,
    };
  }

  /**
   * Evaluate a condition node
   */
  private async evaluateCondition(node: FlowNode, context: any): Promise<boolean> {
    const conditionType = node.data.conditionType;

    switch (conditionType) {
      case 'contains':
        const text = context.triggerData.text || '';
        const keyword = node.data.keyword || '';
        return text.toLowerCase().includes(keyword.toLowerCase());

      case 'if_else':
        // Simple true/false evaluation
        return Math.random() > 0.5; // TODO: Implement proper condition logic

      default:
        return true;
    }
  }

  /**
   * Execute delay
   */
  private async executeDelay(node: FlowNode): Promise<void> {
    const delay = node.data.delay || 1000; // Default 1 second
    console.log(`Waiting ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Trigger flows based on events (called by webhooks)
   */
  async triggerFlowsByEvent(
    tenantId: string,
    triggerType: string,
    eventData: any,
  ) {
    // Find all active flows with matching trigger
    const flows = await this.prisma.flow.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
      },
    });

    // Filter by trigger type manually since trigger is JSON
    const matchingFlows = flows.filter(flow => {
      const trigger = flow.trigger as any;
      return trigger === triggerType || trigger?.type === triggerType;
    });

    console.log(`Found ${matchingFlows.length} flows to trigger for event: ${triggerType}`);

    // Execute each matching flow
    const results = await Promise.all(
      matchingFlows.map((flow) =>
        this.executeFlow(flow.id, eventData, tenantId).catch((error) => {
          console.error(`Failed to execute flow ${flow.id}:`, error);
          return { success: false, error: error.message };
        }),
      ),
    );

    return {
      triggered: matchingFlows.length,
      results,
    };
  }
}
