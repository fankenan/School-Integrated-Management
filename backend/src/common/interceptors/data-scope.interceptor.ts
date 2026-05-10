import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { DATA_SCOPE_KEY, DataScopeConfig } from '../decorators/data-scope.decorator'

export enum DataScopeLevel {
  SCHOOL = 'SCHOOL',
  GRADE = 'GRADE',
  CLASS = 'CLASS',
  SELF = 'SELF',
}

@Injectable()
export class DataScopeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const scopeConfig = this.reflector.getAllAndOverride<DataScopeConfig>(DATA_SCOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!scopeConfig) return next.handle()

    const request = context.switchToHttp().getRequest()
    const { user } = request

    // Attach scope info to request for query builders to use
    request.dataScope = {
      field: scopeConfig.field,
      value: user?.[scopeConfig.userField || scopeConfig.field],
      scopeLevel: user?.scopeLevel || DataScopeLevel.SELF,
      schoolId: user?.schoolId,
    }

    return next.handle()
  }
}
