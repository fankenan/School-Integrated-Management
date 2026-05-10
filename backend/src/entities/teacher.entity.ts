import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, OneToMany,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { School } from './school.entity'
import { Department } from './department.entity'

export enum TeacherStatus {
  ACTIVE = 'active',
  LEAVE = 'leave',
  RESIGNED = 'resigned',
}

@Entity('teachers')
export class Teacher {
  @ApiProperty({ description: '教师ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '工号' })
  @Column({ unique: true, length: 20 })
  teacherNo: string

  @ApiProperty({ description: '姓名' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '性别' })
  @Column({ type: 'char', length: 1, default: 'M' })
  gender: string

  @ApiProperty({ description: '职称', required: false })
  @Column({ length: 30, nullable: true, comment: '高级教师/一级教师/二级教师' })
  title?: string

  @ApiProperty({ description: '任教科目', required: false })
  @Column({ length: 200, nullable: true, comment: '逗号分隔多科目' })
  subjects?: string

  @ApiProperty({ description: '学历', required: false })
  @Column({ length: 20, nullable: true })
  education?: string

  @ApiProperty({ description: '手机号', required: false })
  @Column({ length: 20, nullable: true })
  phone?: string

  @ApiProperty({ description: '邮箱', required: false })
  @Column({ length: 100, nullable: true })
  email?: string

  @ApiProperty({ description: '入职日期', required: false })
  @Column({ type: 'date', nullable: true })
  hireDate?: string

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: TeacherStatus, default: TeacherStatus.ACTIVE })
  status: TeacherStatus

  @ApiProperty({ description: '所属部门ID', required: false })
  @Column({ name: 'department_id', nullable: true })
  departmentId?: string

  @ApiProperty({ description: '所属部门' })
  @ManyToOne(() => Department, { nullable: true })
  department?: Department

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
