import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotificationService } from './notification.service'
import { NotificationTemplate, NotificationRecord, NotificationSetting } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTemplate, NotificationRecord, NotificationSetting])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}