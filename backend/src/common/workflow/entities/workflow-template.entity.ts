import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

export enum WorkflowTemplateStatus {
  DISABLED = 0,
  ACTIVE = 1,
}

@Entity('workflow_templates')
export class WorkflowTemplate {
  @ApiProperty({ description: '模板ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '模板名称' })
  @Column({ length: 100 })
  name: string

  @ApiProperty({ description: '所属模块' })
  @Column({ length: 50, comment: 'office/teaching/logistics/safety' })
  module: string

  @ApiProperty({ description: '版本号' })
  @Column({ default: 1 })
  version: number

  @ApiProperty({ description: '节点配置(JSONB)' })
  @Column({ type: 'jsonb' })
  nodeSchema: Array<{
    order: number
    name: string
    approvalType: string // 'OR' | 'AND' | 'SEQUENTIAL'
    approvers: Array<{ type: string; value: string }> // type: 'user' | 'role' | 'superior'
  }>

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: WorkflowTemplateStatus, default: WorkflowTemplateStatus.ACTIVE })
  status: WorkflowTemplateStatus

  @ApiProperty({ description: '是否启用' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
