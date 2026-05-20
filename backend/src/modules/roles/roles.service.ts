import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Like } from 'typeorm'
import { Role, RoleStatus } from '../../entities/role.entity'
import { Permission } from '../../entities/permission.entity'
import { CreateRoleDto, UpdateRoleDto, RoleQueryDto } from './dto/role.dto'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(query: RoleQueryDto) {
    const { page = 1, pageSize = 10, name, status } = query
    const where: any = {}
    if (name) where.name = Like(`%${name}%`)
    if (status !== undefined && status !== null) where.status = status

    const [list, total] = await this.roleRepository.findAndCount({
      where,
      relations: ['permissions', 'users'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { sort: 'ASC', createdAt: 'DESC' },
    })

    return { list, total, page, pageSize }
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'users'],
    })
    if (!role) throw new NotFoundException('角色不存在')
    return role
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.roleRepository.findOne({ where: { code: dto.code } })
    if (existing) throw new BadRequestException('角色代码已存在')
    const role = this.roleRepository.create(dto)
    return this.roleRepository.save(role)
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.findOne(id)
    if (dto.code && dto.code !== role.code) {
      const existing = await this.roleRepository.findOne({ where: { code: dto.code } })
      if (existing) throw new BadRequestException('角色代码已存在')
    }
    Object.assign(role, dto)
    return this.roleRepository.save(role)
  }

  async remove(id: string) {
    const role = await this.findOne(id)
    return this.roleRepository.remove(role)
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    })
    if (!role) throw new NotFoundException('角色不存在')

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    })
    if (permissions.length !== permissionIds.length) {
      throw new BadRequestException('部分权限ID不存在')
    }

    role.permissions = permissions
    return this.roleRepository.save(role)
  }

  async getPermissions(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    })
    if (!role) throw new NotFoundException('角色不存在')
    return role.permissions || []
  }
}
