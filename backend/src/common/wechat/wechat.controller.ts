import { Controller, Post, Body, Get, Query, UseGuards, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { WechatService } from './wechat.service'
import { Public } from '../decorators/public.decorator'
import { CurrentUser } from '../decorators/current-user.decorator'
import { WechatAppType } from './entities/wechat-user.entity'

@ApiTags('wechat')
@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Get('callback')
  @Public()
  @ApiOperation({ summary: '微信回调验证' })
  async callback(@Query() query: any, @Body() body: any) {
    return this.wechatService.verify(body, query)
  }

  @Post('bind')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '绑定微信账号' })
  async bind(@CurrentUser('userId') userId: string, @Body() body: { code: string }) {
    const userInfo = await this.wechatService.getUserInfoByCode(body.code)
    const record = await this.wechatService.bindWechatUser(
      userId,
      userInfo.openid,
      userInfo.unionid,
      WechatAppType.MINI_PROGRAM,
    )
    return { code: 200, message: '绑定成功', data: record }
  }

  @Get('user-info')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '获取微信用户信息' })
  async getUserInfo(@Query('code') code: string) {
    if (!code) throw new BadRequestException('缺少code参数')
    const userInfo = await this.wechatService.getUserInfoByCode(code)
    return { code: 200, message: '获取成功', data: userInfo }
  }
}