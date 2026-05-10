import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AUDIT_KEY, AuditConfig } from '../decorators/auditable.decorator'

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name)

  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditConfig = this.reflector.getAllAndOverride<AuditConfig>(AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!auditConfig) return next.handle()

    const request = context.switchToHttp().getRequest()
    const { user, method, url, ip, body } = request
    const startTime = Date.now()

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            `[AUDIT] ${auditConfig.module}/${auditConfig.action} | ` +
              `User: ${user?.username || 'unknown'} | ` +
              `${method} ${url} | ` +
              `IP: ${ip} | ` +
              `Duration: ${Date.now() - startTime}ms`,
          )
          // TODO: Persist to audit_logs table
        },
        error: (error) => {
          this.logger.warn(
            `[AUDIT_FAIL] ${auditConfig.module}/${auditConfig.action} | ` +
              `User: ${user?.username || 'unknown'} | ` +
              `Error: ${error.message}`,
          )
        },
      }),
    )
  }
}
