import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity'

export enum SchoolStatus {
  DISABLED = 0,
  ACTIVE = 1,
}

@Entity('schools')
export class School {
  @ApiProperty({ description: '学校ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ description: '学校名称' })
  @Column({ length: 100 })
  name: string

  @ApiProperty({ description: '学校代码' })
  @Column({ unique: true, length: 50 })
  code: string

  @ApiProperty({ description: '学校类型', required: false })
  @Column({ length: 50, nullable: true, comment: 'primary/middle/high/combined' })
  type?: string

  @ApiProperty({ description: '地区/行政区划', required: false })
  @Column({ length: 50, nullable: true })
  region?: string

  @ApiProperty({ description: '详细地址', required: false })
  @Column({ length: 200, nullable: true })
  address?: string

  @ApiProperty({ description: '联系电话', required: false })
  @Column({ length: 20, nullable: true })
  phone?: string

  @ApiProperty({ description: '校长/负责人', required: false })
  @Column({ length: 50, nullable: true })
  principal?: string

  @ApiProperty({ description: '状态: 1-正常 0-禁用' })
  @Column({ type: 'enum', enum: SchoolStatus, default: SchoolStatus.ACTIVE })
  status: SchoolStatus

  @ApiProperty({ description: '用户列表', type: () => [User] })
  @OneToMany(() => User, (user) => user.school)
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
