import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Student } from './student.entity'

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('leaves')
export class Leave {
  @ApiProperty({ description: '请假ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '学生ID' })
  @Column({ name: 'student_id' })
  studentId: string

  @ManyToOne(() => Student, { nullable: true })
  student?: Student

  @ApiProperty({ description: '请假类型' })
  @Column({ length: 20, comment: 'sick/personal/family' })
  type: string

  @ApiProperty({ description: '原因' })
  @Column({ type: 'text', nullable: true })
  reason?: string

  @ApiProperty({ description: '开始时间' })
  @Column({ type: 'timestamp' })
  startTime: Date

  @ApiProperty({ description: '结束时间' })
  @Column({ type: 'timestamp' })
  endTime: Date

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus

  @ApiProperty({ description: '审批人ID', nullable: true })
  @Column({ name: 'approver_id', nullable: true })
  approverId?: string

  @ApiProperty({ description: '审批意见', nullable: true })
  @Column({ type: 'text', nullable: true })
  approvalNote?: string

  @ApiProperty({ description: '离校时间', nullable: true })
  @Column({ type: 'timestamp', nullable: true, name: 'leave_at' })
  leaveAt?: Date

  @ApiProperty({ description: '返校时间', nullable: true })
  @Column({ type: 'timestamp', nullable: true, name: 'return_at' })
  returnAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
