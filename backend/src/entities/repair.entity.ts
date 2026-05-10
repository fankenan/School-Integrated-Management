import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

export enum RepairStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('repairs')
export class Repair {
  @ApiProperty({ description: '维修ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '报修人' })
  @Column({ length: 50 })
  reporter: string

  @ApiProperty({ description: '报修地点' })
  @Column({ length: 100 })
  location: string

  @ApiProperty({ description: '问题描述' })
  @Column({ type: 'text' })
  description: string

  @ApiProperty({ description: '紧急程度', default: 'normal' })
  @Column({ length: 10, default: 'normal' })
  urgency: string

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: RepairStatus, default: RepairStatus.PENDING })
  status: RepairStatus

  @ApiProperty({ description: '维修人', nullable: true })
  @Column({ length: 50, nullable: true })
  repairPerson?: string

  @ApiProperty({ description: '完成时间', nullable: true })
  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date

  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
