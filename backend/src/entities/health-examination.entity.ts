import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('health_examinations')
export class HealthExamination {
  @ApiProperty({ description: '体检ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '学生ID' })
  @Column({ name: 'student_id' })
  studentId: string

  @Column({ name: 'student_name', length: 50, nullable: true })
  studentName?: string

  @Column({ type: 'date' })
  examDate: string

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  height?: number

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  weight?: number

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, comment: '左眼视力' })
  leftVision?: number

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true, comment: '右眼视力' })
  rightVision?: number

  @Column({ length: 20, nullable: true, comment: '血压' })
  bloodPressure?: string

  @Column({ type: 'text', nullable: true, comment: '综合评价' })
  evaluation?: string

  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
