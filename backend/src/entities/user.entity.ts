import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from './role.entity'
import { Department } from './department.entity'
import { School } from './school.entity'

export enum UserStatus {
  DISABLED = 0,
  ACTIVE = 1,
}

@Entity('users')
export class User {
  @ApiProperty({ description: '用户ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '用户名' })
  @Column({ unique: true, length: 50 })
  username: string

  @ApiProperty({ description: '密码' })
  @Column({ length: 255 })
  password: string

  @ApiProperty({ description: '真实姓名' })
  @Column({ length: 50 })
  realName: string

  @ApiProperty({ description: '邮箱', required: false })
  @Column({ length: 100, nullable: true })
  email?: string

  @ApiProperty({ description: '手机号', required: false })
  @Column({ length: 20, nullable: true })
  phone?: string

  @ApiProperty({ description: '头像', required: false })
  @Column({ type: 'text', nullable: true })
  avatar?: string

  @ApiProperty({ description: '状态: 1-正常 0-禁用' })
  @Column({ 
    type: 'enum', 
    enum: UserStatus, 
    default: UserStatus.ACTIVE, 
    comment: '状态: 1-正常 0-禁用' 
  })
  status: UserStatus

  @ApiProperty({ description: '最后登录时间', required: false })
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date

  @ApiProperty({ description: '部门ID', required: false })
  @Column({ name: 'department_id', nullable: true })
  departmentId?: string

  @ApiProperty({ description: '部门', type: () => Department, required: false })
  @ManyToOne(() => Department, (department) => department.users)
  department?: Department

  @ApiProperty({ description: '学校ID', required: false })
  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @ApiProperty({ description: '所属学校', type: () => School, required: false })
  @ManyToOne(() => School, (school) => school.users)
  school?: School

  @ApiProperty({ description: '角色列表', type: () => [Role] })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[]

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}