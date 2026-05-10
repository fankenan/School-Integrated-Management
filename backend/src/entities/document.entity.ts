import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity'

export enum DocumentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

@Entity('documents')
export class Document {
  @ApiProperty({ description: '公文ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '标题' })
  @Column({ length: 200 })
  title: string

  @ApiProperty({ description: '内容' })
  @Column({ type: 'text', nullable: true })
  content?: string

  @ApiProperty({ description: '公文类型' })
  @Column({ length: 30, default: '通知' })
  type: string

  @ApiProperty({ description: '紧急程度' })
  @Column({ length: 10, default: 'normal', comment: 'normal/urgent/emergency' })
  urgency: string

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.DRAFT })
  status: DocumentStatus

  @ApiProperty({ description: '发布范围', nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  publishScope?: { gradeIds?: string[]; classIds?: string[] }

  @ApiProperty({ description: '起草人ID' })
  @Column({ name: 'creator_id', nullable: true })
  creatorId?: string

  @ApiProperty({ description: '起草人' })
  @ManyToOne(() => User, { nullable: true })
  creator?: User

  @Column({ name: 'workflow_instance_id', nullable: true })
  workflowInstanceId?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
