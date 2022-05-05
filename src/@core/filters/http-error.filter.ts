import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { format } from 'date-fns';
import { Request, Response } from 'express';


@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpErrorFilter');
  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    this.logger.log(`[Come HttpErrorFilter...]`, 'ExceptionFilter');
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    /** status code */
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }
    /** message */
    let message: any = 'Internal Server Error';
    if (exception instanceof HttpException) {
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.stack.toString();
    }

    const errorResponse: any = {
      code: status,
      timestamp: format(new Date(), 'dd/MM/yyyy HH:mm:ss aaa'),
      path: request?.url ?? '',
      method: request?.method ?? '',
      message: message.split(','),
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[exception] ${JSON.stringify(exception)}`,
        `ExceptionFilter`,
      );
    }

    this.logger.error(
      `${request?.method} ${request?.url} ${JSON.stringify(errorResponse)}`,
      'ExceptionFilter',
    );

    response?.status(status).json(errorResponse);
  }
}
