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

  /**
   * 查找部门（根据ID）
   */
  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['users', 'children'],
    })
    if (!department) {
      throw new NotFoundException('部门不存在')
    }
    return department
  }

  /**
   * 查询部门树
   */
  async findTree() {
    const departments = await this.departmentRepository.find({
      where: { status: 1 },
      order: { sort: 'ASC', createdAt: 'DESC' },
      relations: ['children', 'users'],
    })

    return this.buildTree(departments)
  }

  /**
   * 构建部门树
   */
  private buildTree(departments: Department[], parentId: string | null = null): Department[] {
    return departments
      .filter((d) => {
        if (!parentId) return !d.parent
        return d.parent?.id === parentId
      })
      .map((d) => ({
        ...d,
        children: this.buildTree(departments, d.id),
      }))
  }

  /**
   * 创建部门
   */
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    // 检查部门代码是否已存在
    const existingDepartment = await this.departmentRepository.findOne({
      where: { code: createDepartmentDto.code },
    })

    if (existingDepartment) {
      throw new BadRequestException('部门代码已存在')
    }

    const department = this.departmentRepository.create(createDepartmentDto)
    return this.departmentRepository.save(department)
  }

  /**
   * 更新部门
   */
  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id)

    // 如果修改了部门代码，检查新代码是否已存在
    if (updateDepartmentDto.code && updateDepartmentDto.code !== department.code) {
      const existingDepartment = await this.departmentRepository.findOne({
        where: { code: updateDepartmentDto.code },
      })

      if (existingDepartment) {
        throw new BadRequestException('部门代码已存在')
      }
    }

    // 如果设置了父部门，检查是否形成了循环
    if (updateDepartmentDto.parentId && updateDepartmentDto.parentId === id) {
      throw new BadRequestException('不能将部门设置为自己的父部门')
    }

    Object.assign(department, updateDepartmentDto)
    return this.departmentRepository.save(department)
  }

  /**
   * 删除部门
   */
  async remove(id: string): Promise<void> {
    const department = await this.findOne(id)

    // 检查是否有子部门
    if (department.children && department.children.length > 0) {
      throw new BadRequestException('请先删除子部门')
    }

    // 检查是否有用户
    if (department.users && department.users.length > 0) {
      throw new BadRequestException('该部门下还有用户，无法删除')
    }

    await this.departmentRepository.remove(department)
  }
}