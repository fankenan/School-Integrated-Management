import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto)
    return {
      code: 200,
      message: '登录成功',
      data: result,
    }
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 200, description: '注册成功' })
  @ApiResponse({ status: 400, description: '用户名已存在' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto)
    return {
      code: 200,
      message: '注册成功',
      data: user,
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '退出登录' })
  @ApiResponse({ status: 200, description: '退出成功' })
  async logout(@Request() req) {
    return {
      code: 200,
      message: '退出成功',
    }
  }

  @Get('userinfo')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getUserInfo(@Request() req) {
    const user = await this.authService.getUserInfo(req.user.userId)
    return {
      code: 200,
      message: '获取成功',
      data: user,
    }
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponse({ status: 200, description: '刷新成功' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    const tokens = await this.authService.refreshToken(body.refreshToken)
    return {
      code: 200,
      message: '刷新成功',
      data: tokens,
    }
  }
}