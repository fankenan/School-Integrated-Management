import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Student } from './student.entity'
import { Class } from './class.entity'

export enum GradeType {
  EXAM = 'exam',
  QUIZ = 'quiz',
  HOMEWORK = 'homework',
  FINAL = 'final',
}

@Entity('grades')
export class Grade {
  @ApiProperty({ description: '成绩ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '学生ID' })
  @Column({ name: 'student_id' })
  studentId: string

  @ManyToOne(() => Student, { nullable: true })
  student?: Student

  @ApiProperty({ description: '科目' })
  @Column({ length: 30 })
  subject: string

  @ApiProperty({ description: '分数' })
  @Column({ type: 'decimal', precision: 5, scale: 1 })
  score: number

  @ApiProperty({ description: '类型' })
  @Column({ type: 'enum', enum: GradeType, default: GradeType.EXAM })
  type: GradeType

  @ApiProperty({ description: '考试名称', nullable: true })
  @Column({ length: 100, nullable: true })
  examName?: string

  @ApiProperty({ description: '学期', nullable: true })
  @Column({ length: 20, nullable: true })
  semester?: string

  @ApiProperty({ description: '学年', nullable: true })
  @Column({ length: 20, nullable: true })
  schoolYear?: string

  @ApiProperty({ description: '班级ID', nullable: true })
  @Column({ name: 'class_id', nullable: true })
  classId?: string

  @ManyToOne(() => Class, { nullable: true })
  class?: Class

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
