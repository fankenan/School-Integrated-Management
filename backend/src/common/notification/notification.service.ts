import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { NotificationTemplate, NotificationRecord, NotificationChannel, NotificationStatus } from './entities'

export interface SendNotificationDto {
  templateCode: string
  receiverId: string
  channel: NotificationChannel
  params?: Record<string, any>
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)

  constructor(
    @InjectRepository(NotificationTemplate)
    private templateRepo: Repository<NotificationTemplate>,
    @InjectRepository(NotificationRecord)
    private recordRepo: Repository<NotificationRecord>,
    private eventEmitter: EventEmitter2,
  ) {}

  async send(dto: SendNotificationDto): Promise<NotificationRecord> {
    const template = await this.templateRepo.findOne({ where: { code: dto.templateCode, isActive: true } })
    if (!template) {
      this.logger.warn(`Notification template not found: ${dto.templateCode}`)
    }

    // Fill template with params
    let content = template?.content || ''
    if (dto.params && template?.params) {
      for (const key of template.params) {
        content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), String(dto.params?.[key] || ''))
      }
    }

    const record = this.recordRepo.create({
      templateCode: dto.templateCode,
      receiverId: dto.receiverId,
      channel: dto.channel,
      params: dto.params,
      status: NotificationStatus.PENDING,
    })

    const savedRecord = await this.recordRepo.save(record)

    // Emit event for async processing (via BullMQ in production)
    this.eventEmitter.emit('notification.send', {
      recordId: savedRecord.id,
      channel: dto.channel,
      receiverId: dto.receiverId,
      content,
      params: dto.params,
    })

    return savedRecord
  }

  async sendToUsers(templateCode: string, receiverIds: string[], channel: NotificationChannel, params?: Record<string, any>) {
    const records: NotificationRecord[] = []
    for (const receiverId of receiverIds) {
      const record = await this.send({ templateCode, receiverId, channel, params })
      records.push(record)
    }
    return records
  }

  async markAsSent(recordId: string, responseData?: Record<string, any>) {
    const record = await this.recordRepo.findOne({ where: { id: recordId } })
    if (record) {
      record.status = NotificationStatus.SENT
      record.sentAt = new Date()
      record.responseData = responseData || undefined
      await this.recordRepo.save(record)
    }
  }

  async markAsFailed(recordId: string, error?: string) {
    const record = await this.recordRepo.findOne({ where: { id: recordId } })
    if (record) {
      record.status = NotificationStatus.FAILED
      record.responseData = error ? { error } : undefined
      await this.recordRepo.save(record)
    }
  }
}