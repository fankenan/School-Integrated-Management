import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity'
import { Permission } from './permission.entity'

export enum RoleStatus {
  DISABLED = 0,
  ACTIVE = 1,
}

@Entity('roles')
export class Role {
  @ApiProperty({ description: '角色ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '角色名称' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '角色代码' })
  @Column({ unique: true, length: 50 })
  code: string

  @ApiProperty({ description: '角色描述', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string

  @ApiProperty({ description: '排序', required: false })
  @Column({ default: 0, comment: '排序' })
  sort: number

  @ApiProperty({ description: '状态: 1-正常 0-禁用' })
  @Column({ 
    type: 'enum', 
    enum: RoleStatus, 
    default: RoleStatus.ACTIVE, 
    comment: '状态: 1-正常 0-禁用' 
  })
  status: RoleStatus

  @ApiProperty({ description: '用户列表', type: () => [User] })
  @ManyToMany(() => User, (user) => user.roles)
  users: User[]

  @ApiProperty({ description: '权限列表', type: () => [Permission] })
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: Permission[]

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