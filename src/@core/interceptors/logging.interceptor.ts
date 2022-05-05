import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('LoggingInterceptor');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log(
      '[Before...]',
      `LoggingInterceptor/${context.getClass().name}`,
    );
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    const method = req.method;
    const url = req.url;

    /** Come when success request */
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${method} ${url} [After...] ${Date.now() - now}ms`,
          `LoggingInterceptor/${context.getClass().name}`,
        );
      }),
    );
  }
}
