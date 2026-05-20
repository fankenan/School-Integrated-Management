import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Tree,
  TreeParent,
  TreeChildren,
  DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity'

export enum DepartmentStatus {
  DISABLED = 0,
  ACTIVE = 1,
}

@Entity('departments')
@Tree('closure-table')
export class Department {
  @ApiProperty({ description: '部门ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '部门名称' })
  @Column({ length: 50 })
  name: string

  @ApiProperty({ description: '部门代码' })
  @Column({ unique: true, length: 50 })
  code: string

  @ApiProperty({ description: '部门描述', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string

  @ApiProperty({ description: '排序', required: false })
  @Column({ default: 0, comment: '排序' })
  sort: number

  @ApiProperty({ description: '负责人', required: false })
  @Column({ length: 50, nullable: true })
  leader?: string

  @ApiProperty({ description: '联系电话', required: false })
  @Column({ length: 20, nullable: true })
  phone?: string

  @ApiProperty({ description: '状态: 1-正常 0-禁用' })
  @Column({ 
    type: 'enum', 
    enum: DepartmentStatus, 
    default: DepartmentStatus.ACTIVE, 
    comment: '状态: 1-正常 0-禁用' 
  })
  status: DepartmentStatus

  @ApiProperty({ description: '父部门', type: () => Department, required: false })
  @TreeParent()
  parent?: Department

  @ApiProperty({ description: '子部门', type: () => [Department], required: false })
  @TreeChildren()
  children?: Department[]

  @ApiProperty({ description: '用户列表', type: () => [User], required: false })
  @ManyToMany(() => User, (user) => user.departments)
  users: User[]

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