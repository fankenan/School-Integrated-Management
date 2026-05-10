import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { School } from './school.entity'
import { Department } from './department.entity'

export enum StaffStatus {
  ACTIVE = 'active',
  LEAVE = 'leave',
  RESIGNED = 'resigned',
}

@Entity('staff')
export class Staff {
  @ApiProperty({ description: '职工ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '工号' })
  @Column({ unique: true, length: 20 })
  staffNo: string

  @ApiProperty({ description: '姓名' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '性别' })
  @Column({ type: 'char', length: 1, default: 'M' })
  gender: string

  @ApiProperty({ description: '岗位', required: false })
  @Column({ length: 50, nullable: true, comment: '保安/保洁/厨师/司机/水电工/文员' })
  position?: string

  @ApiProperty({ description: '手机号', required: false })
  @Column({ length: 20, nullable: true })
  phone?: string

  @ApiProperty({ description: '入职日期', required: false })
  @Column({ type: 'date', nullable: true })
  hireDate?: string

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: StaffStatus, default: StaffStatus.ACTIVE })
  status: StaffStatus

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
