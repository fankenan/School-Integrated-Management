import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { WorkflowNode } from './workflow-node.entity'
import { User } from '../../../entities/user.entity'

export enum ApprovalAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  RETURN = 'RETURN',
}

@Entity('workflow_approvals')
export class WorkflowApproval {
  @ApiProperty({ description: '审批记录ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '所属节点' })
  @ManyToOne(() => WorkflowNode, (node) => node.approvals)
  @JoinColumn({ name: 'node_id' })
  node: WorkflowNode

  @Column({ name: 'node_id' })
  nodeId: string

  @ApiProperty({ description: '审批人' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'approver_id' })
  approver: User

  @Column({ name: 'approver_id' })
  approverId: string

  @ApiProperty({ description: '审批动作' })
  @Column({ type: 'enum', enum: ApprovalAction })
  action: ApprovalAction

  @ApiProperty({ description: '审批意见', required: false })
  @Column({ type: 'text', nullable: true })
  comment?: string

  @ApiProperty({ description: '附件ID列表', required: false })
  @Column({ type: 'jsonb', nullable: true })
  attachments?: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
