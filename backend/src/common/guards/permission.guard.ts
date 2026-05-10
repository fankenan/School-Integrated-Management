import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY } from '../decorators/require-permission.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredPermissions || requiredPermissions.length === 0) return true

    const { user } = context.switchToHttp().getRequest()
    const userPermissions: string[] = user?.permissions || []

    const hasPermission = requiredPermissions.some((perm) => userPermissions.includes(perm))
    if (!hasPermission) {
      throw new ForbiddenException('没有权限访问该资源')
    }
    return true
  }
}
