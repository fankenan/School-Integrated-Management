import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { School } from './school.entity'

@Entity('classes')
export class Class {
  @ApiProperty({ description: '班级ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '班级名称' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '年级', nullable: true })
  @Column({ length: 20, nullable: true })
  grade?: string

  @ApiProperty({ description: '班主任', nullable: true })
  @Column({ length: 50, nullable: true })
  headTeacher?: string

  @ApiProperty({ description: '学生人数', default: 0 })
  @Column({ default: 0 })
  studentCount: number

  @ApiProperty({ description: '教室', nullable: true })
  @Column({ length: 30, nullable: true })
  classroom?: string

  @ApiProperty({ description: '学校ID' })
  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @ManyToOne(() => School, { nullable: true })
  school?: School

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
