import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const PERMISSION_KEY = 'permission'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if (!user || !user.permissions || user.permissions.length === 0) {
      throw new ForbiddenException('没有权限访问该资源')
    }

    const hasPermission = requiredPermissions.some((perm) =>
      user.permissions.includes(perm)
    )

    if (!hasPermission) {
      throw new ForbiddenException(
        `需要以下权限之一: ${requiredPermissions.join(', ')}`
      )
    }

    return true
  }
}
