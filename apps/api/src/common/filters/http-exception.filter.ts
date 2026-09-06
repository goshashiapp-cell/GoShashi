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

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Array<{ field?: string; message: string }> = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, any>;
        message = obj.message || obj.error || message;
        if (Array.isArray(obj.message)) {
          errors = obj.message.map((m: string) => ({ message: m }));
          message = 'Validation failed';
        }
      }
    } else if (exception instanceof Error) {
      // In production, mask internal error details
      message =
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : exception.message;
    }

    response.status(status).json({
      success: false,
      message,
      errors: errors.length > 0 ? errors : undefined,
    });
  }
}
