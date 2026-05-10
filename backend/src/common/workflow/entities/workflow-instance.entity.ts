import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { WorkflowTemplate } from './workflow-template.entity'
import { WorkflowNode } from './workflow-node.entity'
import { User } from '../../../entities/user.entity'

export enum WorkflowInstanceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

@Entity('workflow_instances')
export class WorkflowInstance {
  @ApiProperty({ description: '实例ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '审批模板' })
  @ManyToOne(() => WorkflowTemplate)
  @JoinColumn({ name: 'template_id' })
  template: WorkflowTemplate

  @Column({ name: 'template_id' })
  templateId: string

  @ApiProperty({ description: '业务类型' })
  @Column({ name: 'business_type', length: 50 })
  businessType: string

  @ApiProperty({ description: '业务ID' })
  @Column({ name: 'business_id', type: 'uuid' })
  businessId: string

  @ApiProperty({ description: '审批标题' })
  @Column({ length: 500 })
  title: string

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: WorkflowInstanceStatus, default: WorkflowInstanceStatus.PENDING })
  status: WorkflowInstanceStatus

  @ApiProperty({ description: '发起人' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'initiator_id' })
  initiator: User

  @Column({ name: 'initiator_id' })
  initiatorId: string

  @ApiProperty({ description: '当前节点' })
  @ManyToOne(() => WorkflowNode, { nullable: true })
  @JoinColumn({ name: 'current_node_id' })
  currentNode?: WorkflowNode

  @Column({ name: 'current_node_id', nullable: true })
  currentNodeId?: string

  @ApiProperty({ description: '节点配置快照(JSONB)' })
  @Column({ name: 'node_config_snapshot', type: 'jsonb' })
  nodeConfigSnapshot: object[]

  @ApiProperty({ description: '审批节点列表' })
  @OneToMany(() => WorkflowNode, (node) => node.instance)
  nodes: WorkflowNode[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date
}
