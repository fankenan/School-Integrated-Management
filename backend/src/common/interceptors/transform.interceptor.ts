import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface WrappedResponse<T> {
  code: number
  message: string
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, WrappedResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<WrappedResponse<T>> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()

    return next.handle().pipe(
      map((data) => {
        // If the controller already returned wrapped format, pass through
        if (data && typeof data === 'object' && 'code' in data && 'data' in data) {
          return data
        }
        return {
          code: response.statusCode || 200,
          message: 'OK',
          data: data ?? null,
        }
      }),
    )
  }
}
