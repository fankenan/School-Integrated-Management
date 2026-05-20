import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

export const DATA_SCOPE_KEY = 'dataScope'

export enum DataScopeLevel {
  ALL = 'all',
  SCHOOL = 'school',
  GRADE = 'grade',
  CLASS = 'class',
  SELF = 'self',
}

export interface DataScopeConfig {
  field: string
  selfField?: string
  userField?: string
}

@Injectable()
export class DataScopeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const scopeConfig = this.reflector.getAllAndOverride<DataScopeConfig>(
      DATA_SCOPE_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!scopeConfig) {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      return next.handle()
    }

    request.dataScope = {
      field: scopeConfig.field,
      value: this.resolveScopeValue(user, scopeConfig),
      scopeLevel: user.scopeLevel || DataScopeLevel.SCHOOL,
      schoolId: user.dataScope?.schoolId || user.schoolId,
      gradeIds: user.dataScope?.gradeIds || [],
      classIds: user.dataScope?.classIds || [],
      selfUserId: user.userId,
    }

    return next.handle()
  }

  private resolveScopeValue(user: any, config: DataScopeConfig): any {
    if (config.userField && user[config.userField] !== undefined) {
      return user[config.userField]
    }
    if (config.selfField && user[config.selfField] !== undefined) {
      return user[config.selfField]
    }
    return undefined
  }
}
