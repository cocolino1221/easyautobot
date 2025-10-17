-- CreateTable
CREATE TABLE "flow_node_executions" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "durationMs" INTEGER,

    CONSTRAINT "flow_node_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flow_node_executions_executionId_idx" ON "flow_node_executions"("executionId");

-- CreateIndex
CREATE INDEX "flow_node_executions_nodeId_idx" ON "flow_node_executions"("nodeId");

-- CreateIndex
CREATE INDEX "flow_node_executions_startedAt_idx" ON "flow_node_executions"("startedAt");

-- AddForeignKey
ALTER TABLE "flow_node_executions" ADD CONSTRAINT "flow_node_executions_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "flow_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
