import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User, UserStatus } from '../../entities/user.entity'
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 查找用户（根据ID）
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions', 'department'],
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return user
  }

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    })
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    })
  }

  /**
   * 分页查询用户列表
   */
  async findAll(query: UserQueryDto) {
    const { page = 1, pageSize = 10, username, realName, status, departmentId } = query

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.department', 'department')
      .where('user.deletedAt IS NULL') // 只查询未删除的用户

    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` })
    }

    if (realName) {
      queryBuilder.andWhere('user.realName LIKE :realName', { realName: `%${realName}%` })
    }

    if (status !== undefined) {
      queryBuilder.andWhere('user.status = :status', { status: Number(status) })
    }

    if (departmentId) {
      queryBuilder.andWhere('user.departmentId = :departmentId', { departmentId })
    }

    const [list, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount()

    return {
      list: list.map((user) => this.sanitizeUser(user)),
      total,
      page,
      pageSize,
    }
  }

  /**
   * 创建用户
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.findByUsername(createUserDto.username)
    if (existingUser) {
      throw new BadRequestException('用户名已存在')
    }

    // 检查邮箱是否已存在
    if (createUserDto.email) {
      const existingEmail = await this.findByEmail(createUserDto.email)
      if (existingEmail) {
        throw new BadRequestException('邮箱已被使用')
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    return this.userRepository.save(user)
  }

  /**
   * 更新用户
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    // 如果修改了用户名，检查新用户名是否已存在
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateUserDto.username)
      if (existingUser) {
        throw new BadRequestException('用户名已存在')
      }
    }

    // 如果修改了邮箱，检查新邮箱是否已存在
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.findByEmail(updateUserDto.email)
      if (existingEmail) {
        throw new BadRequestException('邮箱已被使用')
      }
    }

    // 如果修改了密码，加密新密码
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    Object.assign(user, updateUserDto)
    return this.userRepository.save(user)
  }

  /**
   * 删除用户
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.userRepository.remove(user)
  }

  /**
   * 更新最后登录时间
   */
  async updateLastLoginTime(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() })
  }

  /**
   * 清理用户信息（移除敏感字段）
   */
  private sanitizeUser(user: User) {
    const { password, ...result } = user
    return result
  }
}