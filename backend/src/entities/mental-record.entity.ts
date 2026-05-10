import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Student } from './student.entity'
import { User } from './user.entity'

export enum MentalStatus {
  NORMAL = 'normal',
  ATTENTION = 'attention',
  WARNING = 'warning',
  CRISIS = 'crisis',
}

@Entity('mental_records')
export class MentalRecord {
  @ApiProperty({ description: '记录ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'student_id' })
  studentId: string

  @ManyToOne(() => Student, { nullable: true })
  student?: Student

  @Column({ name: 'student_name', length: 50, nullable: true })
  studentName?: string

  @Column({ length: 30, comment: '测评量表名称' })
  scaleName: string

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true, comment: '测评得分' })
  score?: number

  @Column({ type: 'enum', enum: MentalStatus, default: MentalStatus.NORMAL })
  status: MentalStatus

  @Column({ type: 'text', nullable: true, comment: '评估结果' })
  result?: string

  @Column({ type: 'text', nullable: true, comment: '干预措施' })
  intervention?: string

  @Column({ name: 'counselor_id', nullable: true })
  counselorId?: string

  @ManyToOne(() => User, { nullable: true })
  counselor?: User

  @Column({ type: 'date', name: 'evaluation_date' })
  evaluationDate: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
