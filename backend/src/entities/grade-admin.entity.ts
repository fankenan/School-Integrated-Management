import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, OneToOne, JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity'
import { School } from './school.entity'
import { Department } from './department.entity'

export enum GradeLevel {
  GRADE_7 = 'grade_7',
  GRADE_8 = 'grade_8',
  GRADE_9 = 'grade_9',
  GRADE_10 = 'grade_10',
  GRADE_11 = 'grade_11',
  GRADE_12 = 'grade_12',
}

@Entity('grade_admins')
export class GradeAdmin {
  @ApiProperty({ description: 'ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '关联用户', type: () => User })
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id' })
  userId: string

  @ApiProperty({ description: '所属学校', type: () => School })
  @ManyToOne(() => School)
  school: School

  @Column({ name: 'school_id' })
  schoolId: string

  @ApiProperty({ description: '管理的年级' })
  @Column({ type: 'enum', enum: GradeLevel })
  gradeLevel: GradeLevel

  @ApiProperty({ description: '年级名称', example: '初一年级' })
  @Column({ length: 50 })
  gradeName: string

  @ApiProperty({ description: '关联部门/年级', type: () => Department, required: false })
  @ManyToOne(() => Department, { nullable: true })
  department?: Department

  @Column({ name: 'department_id', nullable: true })
  departmentId?: string

  @ApiProperty({ description: '备注', required: false })
  @Column({ type: 'text', nullable: true })
  remark?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
