import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        errors = responseObj.errors || null;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log error for debugging
    console.error('Error occurred:', {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Send user-friendly response
    response.status(status).json({
      success: false,
      statusCode: status,
      message: this.getUserFriendlyMessage(status, message),
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getUserFriendlyMessage(status: number, originalMessage: string): string {
    const friendlyMessages: Record<number, string> = {
      400: '⚠️ Invalid request. Please check your input and try again.',
      401: '🔒 You need to be logged in to access this resource.',
      403: '🚫 You don\'t have permission to perform this action.',
      404: '🔍 The requested resource was not found.',
      409: '⚠️ This action conflicts with existing data.',
      422: '📝 Validation failed. Please check the highlighted fields.',
      429: '⏱️ Too many requests. Please slow down and try again later.',
      500: '💥 Something went wrong on our end. Please try again later.',
      503: '🔧 Service temporarily unavailable. Please try again in a moment.',
    };

    return friendlyMessages[status] || originalMessage;
  }
}
