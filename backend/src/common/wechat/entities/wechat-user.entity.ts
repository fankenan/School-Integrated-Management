import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../../../entities/user.entity'

export enum WechatAppType {
  OFFICIAL_ACCOUNT = 'official_account',
  MINI_PROGRAM = 'mini_program',
}

@Entity('wechat_users')
export class WechatUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User

  @Column({ length: 128 })
  openid: string

  @Column({ length: 128, nullable: true })
  unionid?: string

  @Column({ name: 'app_type', type: 'enum', enum: WechatAppType })
  appType: WechatAppType

  @Column({ name: 'subscribe_status', default: 0 })
  subscribeStatus: number

  @Column({ name: 'subscribe_time', type: 'timestamp', nullable: true })
  subscribeTime?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}