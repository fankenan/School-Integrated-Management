import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import axios from 'axios'
import * as crypto from 'crypto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WechatUser, WechatAppType } from './entities/wechat-user.entity'

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name)
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(WechatUser)
    private wechatUserRepo: Repository<WechatUser>,
  ) {}

  // ---被动消息接收验证---
  async verify(message: any, query: any) {
    const { signature, timestamp, nonce, echostr } = query
    const token = this.configService.get<string>('WECHAT_TOKEN')
    const arr = [token, timestamp, nonce].sort()
    const str = arr.join('')
    const hash = crypto.createHash('sha1').update(str).digest('hex')

    if (signature === hash) {
      if (echostr) return echostr
      // Handle event/push messages
      this.handleMessage(message)
    }
    return 'success'
  }

  private handleMessage(message: any) {
    const { MsgType, Event, FromUserName } = message
    if (MsgType === 'event') {
      if (Event === 'subscribe') {
        this.eventEmitter.emit('wechat.subscribe', { openid: FromUserName })
      }
    }
  }

  // ---获取access_token---
  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }
    const appid = this.configService.get<string>('WECHAT_APPID')
    const secret = this.configService.get<string>('WECHAT_SECRET')
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
    const res = await axios.get(url).then((r) => r.data)
    this.accessToken = res.access_token
    this.tokenExpiry = Date.now() + (res.expires_in - 200) * 1000
    return this.accessToken
  }

  // ---发送模板消息---
  async sendTemplateMessage(touser: string, templateId: string, data: Record<string, { value: string; color?: string }>, url?: string) {
    const token = await this.getAccessToken()
    const api = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`
    const res = await axios.post(api, { touser, template_id: templateId, data, url }).then((r) => r.data)
    if (res.errcode !== 0) {
      this.logger.error(`Template message failed: ${res.errmsg}`)
      throw new BadRequestException(`微信消息发送失败: ${res.errmsg}`)
    }
    return res
  }

  // ---网页授权获取用户信息---
  async getUserInfoByCode(code: string) {
    const appid = this.configService.get<string>('WECHAT_APPID')
    const secret = this.configService.get<string>('WECHAT_SECRET')
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
    const res = await axios.get(url).then((r) => r.data)
    if (res.errcode) throw new BadRequestException(res.errmsg)
    const userInfo = await axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${res.access_token}&openid=${res.openid}&lang=zh_CN`).then((r) => r.data)
    return { ...res, ...userInfo }
  }

  // ---绑定微信用户到系统账号---
  async bindWechatUser(userId: string, openid: string, unionid: string, appType: WechatAppType) {
    let record = await this.wechatUserRepo.findOne({ where: { openid, appType } })
    if (record) {
      record.userId = userId
      record.unionid = unionid
    } else {
      record = this.wechatUserRepo.create({ userId, openid, unionid, appType })
    }
    return this.wechatUserRepo.save(record)
  }

  // ---获取用户openid---
  async getUserByUnionid(unionid: string) {
    return this.wechatUserRepo.findOne({ where: { unionid }, relations: ['user'] })
  }
}