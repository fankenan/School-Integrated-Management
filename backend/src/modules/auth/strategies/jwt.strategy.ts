import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserStatus } from '../../../entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, status: UserStatus.ACTIVE },
      relations: ['roles', 'roles.permissions', 'department', 'school'],
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用')
    }

    const permissions: string[] = []
    for (const role of user.roles || []) {
      for (const perm of role.permissions || []) {
        if (perm.code && !permissions.includes(perm.code)) {
          permissions.push(perm.code)
        }
      }
    }

    return {
      userId: user.id,
      username: user.username,
      roles: (user.roles || []).map((r) => r.code),
      permissions,
      schoolId: user.schoolId,
      departmentId: user.departmentId,
      dataScope: {
        schoolId: user.schoolId,
        departmentId: user.departmentId,
      },
    }
  }
}
