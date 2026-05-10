import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Role } from '../../entities/role.entity'
import { CreateRoleDto, UpdateRoleDto, RoleQueryDto } from './dto/role.dto'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 查找角色（根据ID）
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    })
    if (!role) {
      throw new NotFoundException('角色不存在')
    }
    return role
  }

  /**
   * 根据代码查找角色
   */
  async findByCode(code: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { code },
    })
  }

  /**
   * 分页查询角色列表
   */
  async findAll(query: RoleQueryDto) {
    const { page = 1, pageSize = 10, name, status } = query

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')

    if (name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${name}%` })
    }

    if (status !== undefined) {
      queryBuilder.andWhere('role.status = :status', { status })
    }

    const [list, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('role.sort', 'ASC')
      .addOrderBy('role.createdAt', 'DESC')
      .getManyAndCount()

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 创建角色
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // 检查角色代码是否已存在
    const existingRole = await this.findByCode(createRoleDto.code)
    if (existingRole) {
      throw new BadRequestException('角色代码已存在')
    }

    const role = this.roleRepository.create(createRoleDto)
    return this.roleRepository.save(role)
  }

  /**
   * 更新角色
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id)

    // 如果修改了角色代码，检查新代码是否已存在
    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existingRole = await this.findByCode(updateRoleDto.code)
      if (existingRole) {
        throw new BadRequestException('角色代码已存在')
      }
    }

    Object.assign(role, updateRoleDto)
    return this.roleRepository.save(role)
  }

  /**
   * 删除角色
   */
  async remove(id: string): Promise<void> {
    const role = await this.findOne(id)
    await this.roleRepository.remove(role)
  }

  /**
   * 分配权限
   */
  async assignPermissions(id: string, permissionIds: string[]): Promise<Role> {
    const role = await this.findOne(id)

    // 这里需要处理权限分配逻辑
    // 实际实现需要根据TypeORM的关系处理

    return this.findOne(id)
  }
}