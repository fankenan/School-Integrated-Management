import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToMany, JoinTable, ManyToOne, OneToOne, JoinColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Student } from './student.entity'
import { School } from './school.entity'
import { User } from './user.entity'

export enum ParentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ParentRelation {
  FATHER = 'father',
  MOTHER = 'mother',
  GUARDIAN = 'guardian',
  OTHER = 'other',
}

@Entity('parents')
export class Parent {
  @ApiProperty({ description: '家长ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '姓名' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '性别: M-男 F-女' })
  @Column({ type: 'char', length: 1, default: 'M' })
  gender: string

  @ApiProperty({ description: '手机号' })
  @Column({ length: 20 })
  phone: string

  @ApiProperty({ description: '邮箱', required: false })
  @Column({ length: 100, nullable: true })
  email?: string

  @ApiProperty({ description: '与学生的关系' })
  @Column({ type: 'enum', enum: ParentRelation, default: ParentRelation.GUARDIAN })
  relation: ParentRelation

  @ApiProperty({ description: '微信号/openid', required: false })
  @Column({ name: 'wechat_open_id', length: 100, nullable: true })
  wechatOpenId?: string

  @ApiProperty({ description: '状态' })
  @Column({ type: 'enum', enum: ParentStatus, default: ParentStatus.ACTIVE })
  status: ParentStatus

  @ApiProperty({ description: '关联登录账号', type: () => User, required: false })
  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User

  @Column({ name: 'user_id', nullable: true })
  userId?: string

  @ApiProperty({ description: '所属学校', type: () => School, required: false })
  @ManyToOne(() => School, { nullable: true })
  school?: School

  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @ApiProperty({ description: '绑定学生', type: () => [Student] })
  @ManyToMany(() => Student)
  @JoinTable({
    name: 'parent_students',
    joinColumn: { name: 'parent_id' },
    inverseJoinColumn: { name: 'student_id' },
  })
  students: Student[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
