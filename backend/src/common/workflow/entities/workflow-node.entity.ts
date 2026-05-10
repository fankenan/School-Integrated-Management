import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { WorkflowInstance } from './workflow-instance.entity'
import { WorkflowApproval } from './workflow-approval.entity'

export enum WorkflowNodeStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

@Entity('workflow_nodes')
export class WorkflowNode {
  @ApiProperty({ description: '节点ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '所属审批实例' })
  @ManyToOne(() => WorkflowInstance, (instance) => instance.nodes)
  @JoinColumn({ name: 'instance_id' })
  instance: WorkflowInstance

  @Column({ name: 'instance_id' })
  instanceId: string

  @ApiProperty({ description: '节点顺序' })
  @Column({ name: 'node_order' })
  nodeOrder: number

  @ApiProperty({ description: '节点名称' })
  @Column({ name: 'node_name', length: 100 })
  nodeName: string

  @ApiProperty({ description: '审批类型: OR/AND/SEQUENTIAL' })
  @Column({ name: 'approval_type', length: 20 })
  approvalType: string

  @ApiProperty({ description: '审批人配置(JSONB)' })
  @Column({ type: 'jsonb' })
  approvers: Array<{ type: string; value: string; userId?: string; name?: string }>

  @ApiProperty({ description: '节点状态' })
  @Column({ type: 'enum', enum: WorkflowNodeStatus, default: WorkflowNodeStatus.PENDING })
  status: WorkflowNodeStatus

  @ApiProperty({ description: '审批记录' })
  @OneToMany(() => WorkflowApproval, (approval) => approval.node)
  approvals: WorkflowApproval[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt?: Date

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt?: Date
}
