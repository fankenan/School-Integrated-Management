import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  WECHAT_TEMPLATE = 'WECHAT_TEMPLATE',
  WECHAT_SUBSCRIBE = 'WECHAT_SUBSCRIBE',
  SMS = 'SMS',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

@Entity('notification_templates')
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '模板编码' })
  @Column({ unique: true, length: 100 })
  code: string

  @ApiProperty({ description: '模板标题' })
  @Column({ length: 200 })
  title: string

  @ApiProperty({ description: '模板内容' })
  @Column({ type: 'text' })
  content: string

  @ApiProperty({ description: '支持渠道' })
  @Column({ type: 'jsonb' })
  channels: NotificationChannel[]

  @ApiProperty({ description: '参数占位符' })
  @Column({ type: 'jsonb', nullable: true })
  params?: string[]

  @ApiProperty({ description: '所属模块' })
  @Column({ length: 50, nullable: true })
  module?: string

  @ApiProperty({ description: '状态' })
  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

@Entity('notification_records')
export class NotificationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'template_code', length: 100 })
  templateCode: string

  @Column({ name: 'receiver_id', type: 'uuid' })
  receiverId: string

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus

  @Column({ type: 'jsonb', nullable: true })
  params?: Record<string, any>

  @Column({ type: 'jsonb', nullable: true })
  responseData?: Record<string, any>

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

@Entity('notification_settings')
export class NotificationSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel

  @Column({ default: true })
  enabled: boolean

  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, any>
}