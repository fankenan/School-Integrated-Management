import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from './role.entity'

export enum PermissionStatus {
  DISABLED = 0,
  ACTIVE = 1,
}

export enum PermissionType {
  MENU = 'menu',
  BUTTON = 'button',
  API = 'api',
}

export enum PermissionVisible {
  HIDDEN = 0,
  VISIBLE = 1,
}

@Entity('permissions')
export class Permission {
  @ApiProperty({ description: '权限ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '权限名称' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '权限代码' })
  @Column({ unique: true, length: 100 })
  code: string

  @ApiProperty({ description: '权限类型: menu-菜单, button-按钮, api-接口' })
  @Column({ 
    type: 'enum', 
    enum: PermissionType, 
    default: PermissionType.MENU, 
    comment: '权限类型: menu-菜单, button-按钮, api-接口' 
  })
  type: PermissionType

  @ApiProperty({ description: '父权限ID', required: false })
  @Column({ name: 'parent_id', nullable: true })
  parentId?: string

  @ApiProperty({ description: '路由路径', required: false })
  @Column({ nullable: true })
  path?: string

  @ApiProperty({ description: '组件路径', required: false })
  @Column({ name: 'component', nullable: true })
  component?: string

  @ApiProperty({ description: '图标', required: false })
  @Column({ nullable: true })
  icon?: string

  @ApiProperty({ description: '排序', required: false })
  @Column({ default: 0, comment: '排序' })
  sort: number

  @ApiProperty({ description: '状态: 1-正常 0-禁用' })
  @Column({ 
    type: 'enum', 
    enum: PermissionStatus, 
    default: PermissionStatus.ACTIVE, 
    comment: '状态: 1-正常 0-禁用' 
  })
  status: PermissionStatus

  @ApiProperty({ description: '是否可见: 1-可见 0-隐藏' })
  @Column({ 
    type: 'enum', 
    enum: PermissionVisible, 
    default: PermissionVisible.VISIBLE, 
    comment: '是否可见: 1-可见 0-隐藏' 
  })
  visible: PermissionVisible

  @ApiProperty({ description: '角色列表', type: () => [Role] })
  @ManyToMany(() => Role, (role) => role.permissions)
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