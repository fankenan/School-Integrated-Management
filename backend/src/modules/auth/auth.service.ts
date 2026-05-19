import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'

import { UsersService } from '../users/users.service'
import { User, UserStatus } from '../../entities/user.entity'
import { LoginDto, RegisterDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('账号已被禁用')
    }

    const tokens = await this.generateTokens(user)

    // 更新最后登录时间
    await this.usersService.updateLastLoginTime(user.id)

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    }
  }

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto) {
    // 检查用户名是否已存在
    const existingUser = await this.usersService.findByUsername(registerDto.username)
    if (existingUser) {
      throw new BadRequestException('用户名已存在')
    }

    // 检查邮箱是否已存在
    if (registerDto.email) {
      const existingEmail = await this.usersService.findByEmail(registerDto.email)
      if (existingEmail) {
        throw new BadRequestException('邮箱已被使用')
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    // 创建用户
    const user = await this.usersService.create({
      username: registerDto.username,
      password: hashedPassword,
      realName: registerDto.realName,
      email: registerDto.email,
      phone: registerDto.phone,
      status: 1,
    })

    return this.sanitizeUser(user)
  }

  /**
   * 验证用户
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username)
    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    return user
  }

  /**
   * 生成访问令牌和刷新令牌
   */
  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles.map((role) => role.code),
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION', '7d'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '30d'),
      }),
    ])

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<number>('JWT_EXPIRATION', 7) * 24 * 60 * 60,
    }
  }

  /**
   * 刷新令牌
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })

      const user = await this.usersService.findOne(payload.sub)
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('用户不存在或已被禁用')
      }

      return this.generateTokens(user)
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效或已过期')
    }
  }

  /**
   * 清理用户信息（移除敏感字段）
   */
  private sanitizeUser(user: User) {
    const { password, ...result } = user
    return result
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: string): Promise<any> {
    const user = await this.usersService.findOne(userId)
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('用户不存在或已被禁用')
    }
    return this.sanitizeUser(user)
  }
}