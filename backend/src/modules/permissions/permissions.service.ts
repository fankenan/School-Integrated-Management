import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Permission } from '../../entities/permission.entity'
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto'

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * 查找权限（根据ID）
   */
  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['roles'],
    })
    if (!permission) {
      throw new NotFoundException('权限不存在')
    }
    return permission
  }

  /**
   * 查询权限树
   */
  async findTree() {
    const permissions = await this.permissionRepository.find({
      where: { status: 1 },
      order: { sort: 'ASC', createdAt: 'DESC' },
    })

    return this.buildTree(permissions)
  }

  /**
   * 构建权限树
   */
  private buildTree(permissions: Permission[], parentId: string | null = null): any[] {
    return permissions
      .filter((p) => p.parentId === parentId)
      .map((p) => ({
        ...p,
        children: this.buildTree(permissions, p.id),
      }))
  }

  /**
   * 创建权限
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create({
      ...createPermissionDto,
      type: createPermissionDto.type as any,
    })
    return this.permissionRepository.save(permission)
  }

  /**
   * 更新权限
   */
  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOne(id)
    Object.assign(permission, updatePermissionDto)
    return this.permissionRepository.save(permission)
  }

  /**
   * 删除权限
   */
  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id)

    // 检查是否有子权限
    const hasChildren = await this.permissionRepository.count({
      where: { parentId: id },
    })

    if (hasChildren > 0) {
      throw new Error('请先删除子权限')
    }

    await this.permissionRepository.remove(permission)
  }
}