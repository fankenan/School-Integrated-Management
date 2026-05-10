import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, OneToMany,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { School } from './school.entity'
import { Department } from './department.entity'

export enum StudentStatus {
  STUDYING = 'studying',
  SUSPENDED = 'suspended',
  TRANSFERRED = 'transferred',
  GRADUATED = 'graduated',
}

@Entity('students')
export class Student {
  @ApiProperty({ description: '学生ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '学号' })
  @Column({ unique: true, length: 20 })
  studentNo: string

  @ApiProperty({ description: '姓名' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '性别: M-男 F-女' })
  @Column({ type: 'char', length: 1, default: 'M' })
  gender: string

  @ApiProperty({ description: '出生日期', required: false })
  @Column({ type: 'date', nullable: true })
  birthday?: string

  @ApiProperty({ description: '身份证号', required: false })
  @Column({ length: 18, nullable: true })
  idCard?: string

  @ApiProperty({ description: '家庭住址', required: false })
  @Column({ length: 200, nullable: true })
  address?: string

  @ApiProperty({ description: '联系电话', required: false })
  @Column({ length: 20, nullable: true })
  phone?: string

  @ApiProperty({ description: '监护人姓名', required: false })
  @Column({ length: 50, nullable: true })
  guardianName?: string

  @ApiProperty({ description: '监护人电话', required: false })
  @Column({ length: 20, nullable: true })
  guardianPhone?: string

  @ApiProperty({ description: '监护人关系', required: false })
  @Column({ length: 20, nullable: true })
  guardianRelation?: string

  @ApiProperty({ description: '入学日期', required: false })
  @Column({ type: 'date', nullable: true })
  enrollmentDate?: string

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.STUDYING })
  status: StudentStatus

  @ApiProperty({ description: '班级ID', required: false })
  @Column({ name: 'class_id', nullable: true })
  classId?: string

  @ApiProperty({ description: '所属班级' })
  @ManyToOne(() => Department, { nullable: true })
  class?: Department

  @ApiProperty({ description: '学校ID' })
  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @ApiProperty({ description: '所属学校' })
  @ManyToOne(() => School, { nullable: true })
  school?: School

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
