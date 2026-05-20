import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Department } from '../../entities/department.entity'
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto'

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['users', 'children', 'parent'],
    })
    if (!department) throw new NotFoundException('部门不存在')
    return department
  }

  async findAll() {
    return this.departmentRepository.find({
      where: { status: 1 },
      order: { sort: 'ASC', createdAt: 'DESC' },
      relations: ['parent', 'children', 'users'],
    })
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { code: dto.code },
    })
    if (existingDepartment) throw new BadRequestException('部门代码已存在')

    const { parentId, ...rest } = dto as any
    const department = this.departmentRepository.create(rest)

    if (parentId) {
      const parent = await this.departmentRepository.findOne({ where: { id: parentId } })
      if (!parent) throw new BadRequestException('父部门不存在')
      department.parent = parent
    }

    return this.departmentRepository.save(department)
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id)

    if (dto.code && dto.code !== department.code) {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { code: dto.code },
      })
      if (existingDepartment) throw new BadRequestException('部门代码已存在')
    }

    const { parentId, ...rest } = dto as any

    if (parentId !== undefined) {
      if (parentId && parentId === id) {
        throw new BadRequestException('不能将部门设置为自己的父部门')
      }
      if (parentId) {
        const parent = await this.departmentRepository.findOne({ where: { id: parentId } })
        if (!parent) throw new BadRequestException('父部门不存在')
        department.parent = parent
      } else {
        department.parent = null as any
      }
    }

    Object.assign(department, rest)
    return this.departmentRepository.save(department)
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id)

    if (department.children && department.children.length > 0) {
      throw new BadRequestException('请先删除子部门')
    }

    if (department.users && department.users.length > 0) {
      throw new BadRequestException('该部门下还有用户，无法删除')
    }

    await this.departmentRepository.remove(department)
  }
}
