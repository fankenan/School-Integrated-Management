import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GradeAdmin } from '../../entities/grade-admin.entity'
import { User } from '../../entities/user.entity'
import { Role } from '../../entities/role.entity'
import { Department } from '../../entities/department.entity'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class GradeAdminsService {
  constructor(
    @InjectRepository(GradeAdmin) private readonly repo: Repository<GradeAdmin>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Department) private readonly deptRepo: Repository<Department>,
  ) {}

  async findAll(query: { page?: number; pageSize?: number; schoolId?: string }) {
    const { page = 1, pageSize = 10, schoolId } = query
    const qb = this.repo.createQueryBuilder('ga')
      .leftJoinAndSelect('ga.user', 'u')
      .leftJoinAndSelect('ga.school', 's')
      .leftJoinAndSelect('ga.department', 'd')
    if (schoolId) qb.andWhere('ga.school_id = :sid', { sid: schoolId })
    qb.skip((+page - 1) * +pageSize).take(+pageSize).orderBy('ga.createdAt', 'DESC')
    const [list, total] = await qb.getManyAndCount()
    return { list, total, page, pageSize }
  }

  async findOne(id: string) {
    const r = await this.repo.findOne({ where: { id }, relations: ['user', 'school', 'department'] })
    if (!r) throw new NotFoundException('年级管理员不存在')
    return r
  }

  async create(dto: {
    username: string; password: string; realName: string;
    schoolId: string; gradeLevel: string; gradeName: string;
    departmentId?: string; phone?: string;
  }) {
    const existing = await this.userRepo.findOne({ where: { username: dto.username } })
    if (existing) throw new BadRequestException('用户名已存在')

    const hashed = await bcrypt.hash(dto.password, 10)
    const user = this.userRepo.create({
      username: dto.username, password: hashed, realName: dto.realName,
      phone: dto.phone, schoolId: dto.schoolId,
    })

    const role = await this.roleRepo.findOne({ where: { code: 'grade_admin' } })
    if (role) user.roles = [role]

    const savedUser = await this.userRepo.save(user)

    const gradeAdmin = this.repo.create({
      userId: savedUser.id, schoolId: dto.schoolId,
      gradeLevel: dto.gradeLevel as any, gradeName: dto.gradeName,
      departmentId: dto.departmentId,
    })

    const saved = await this.repo.save(gradeAdmin)
    return { ...saved, user: savedUser }
  }

  async remove(id: string) {
    const ga = await this.findOne(id)
    await this.repo.softRemove(ga)
    return { deleted: true }
  }
}
