import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, In } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { User, UserStatus } from '../../entities/user.entity'
import { Department } from '../../entities/department.entity'
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions', 'departments'],
    })
    if (!user) throw new NotFoundException('用户不存在')
    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async findAll(query: UserQueryDto) {
    const { page = 1, pageSize = 10, username, realName, status, departmentId } = query
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.departments', 'department')
      .where('user.deletedAt IS NULL')

    if (username) qb.andWhere('user.username LIKE :username', { username: `%${username}%` })
    if (realName) qb.andWhere('user.realName LIKE :realName', { realName: `%${realName}%` })
    if (status !== undefined) qb.andWhere('user.status = :status', { status: Number(status) })

    const [list, total] = await qb.skip((page - 1) * pageSize).take(pageSize).orderBy('user.createdAt', 'DESC').getManyAndCount()
    return { list: list.map((u) => this.sanitizeUser(u)), total, page, pageSize }
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByUsername(dto.username)
    if (existingUser) throw new BadRequestException('用户名已存在')
    if (dto.email) {
      const existingEmail = await this.findByEmail(dto.email)
      if (existingEmail) throw new BadRequestException('邮箱已被使用')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const { departmentIds, ...rest } = dto as any
    const user = this.userRepository.create({ ...rest, password: hashedPassword })

    if (departmentIds?.length) {
      user.departments = await this.departmentRepository.find({ where: { id: In(departmentIds) } })
    }

    return this.userRepository.save(user)
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    if (dto.username && dto.username !== user.username) {
      const existingUser = await this.findByUsername(dto.username)
      if (existingUser) throw new BadRequestException('用户名已存在')
    }
    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.findByEmail(dto.email)
      if (existingEmail) throw new BadRequestException('邮箱已被使用')
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10)
    }

    const { departmentIds, ...rest } = dto as any
    Object.assign(user, rest)

    if (departmentIds !== undefined) {
      user.departments = departmentIds.length > 0
        ? await this.departmentRepository.find({ where: { id: In(departmentIds) } })
        : []
    }

    return this.userRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.userRepository.remove(user)
  }

  async updateLastLoginTime(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() })
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user
    return result
  }
}
