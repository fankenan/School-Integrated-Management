import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, ManyToMany, JoinTable,
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
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus

  @ApiProperty({ description: '最后登录时间', required: false })
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date

  @ApiProperty({ description: '所属部门', type: () => [Department], required: false })
  @ManyToMany(() => Department, (department) => department.users)
  @JoinTable({
    name: 'user_departments',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'department_id', referencedColumnName: 'id' },
  })
  departments: Department[]

  @ApiProperty({ description: '所属学校', type: () => School, required: false })
  @ManyToOne(() => School, (school) => school.users)
  school?: School

  @Column({ name: 'school_id', nullable: true })
  schoolId?: string

  @ApiProperty({ description: '角色列表', type: () => [Role] })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
