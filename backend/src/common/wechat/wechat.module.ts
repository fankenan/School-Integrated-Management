import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { NotificationModule } from '../notification/notification.module'
import { WechatService } from './wechat.service'
import { WechatController } from './wechat.controller'
import { WechatUser } from './entities/wechat-user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    EventEmitterModule,
    NotificationModule,
    TypeOrmModule.forFeature([WechatUser]),
  ],
  controllers: [WechatController],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}