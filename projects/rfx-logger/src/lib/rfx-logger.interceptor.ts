import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RfxLoggerService } from './rfx-logger.service';

@Injectable()
export class RfxLoggerInterceptor implements HttpInterceptor {
  constructor(private rfxLoggerService: RfxLoggerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const startTime: number = Date.now();

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.rfxLoggerService.success(request.url, {
            timeMs: Date.now() - startTime,
            response: event
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          this.rfxLoggerService.error(request.url, {
            timeMs: Date.now() - startTime,
            response: error
          });
        }

        return EMPTY;
      }),
    ) as Observable<HttpEvent<any>>;
  }
}
