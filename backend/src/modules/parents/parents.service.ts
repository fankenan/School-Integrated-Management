import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Like } from 'typeorm'
import { Parent } from '../../entities/parent.entity'
import { Student } from '../../entities/student.entity'
import { User } from '../../entities/user.entity'
import { Role } from '../../entities/role.entity'
import { CreateParentDto, UpdateParentDto, ParentQueryDto, CreateParentAccountDto } from './dto/parent.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent) private readonly parentRepo: Repository<Parent>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(query: ParentQueryDto) {
    const { page = 1, pageSize = 10, keyword, relation, status, schoolId } = query
    const qb = this.parentRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.students', 's')
      .leftJoinAndSelect('p.user', 'u')
      .where('1=1')

    if (keyword) qb.andWhere('(p.name LIKE :kw OR p.phone LIKE :kw)', { kw: `%${keyword}%` })
    if (relation) qb.andWhere('p.relation = :rel', { rel: relation })
    if (status) qb.andWhere('p.status = :st', { st: status })
    if (schoolId) qb.andWhere('p.school_id = :sid', { sid: schoolId })

    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('p.createdAt', 'DESC')
    const [list, total] = await qb.getManyAndCount()
    return { list, total, page, pageSize }
  }

  async findOne(id: string) {
    const parent = await this.parentRepo.findOne({ where: { id }, relations: ['students', 'user'] })
    if (!parent) throw new NotFoundException('家长不存在')
    return parent
  }

  async create(dto: CreateParentDto) {
    const parent = this.parentRepo.create({
      name: dto.name, gender: dto.gender || 'M', phone: dto.phone,
      email: dto.email, relation: (dto.relation || 'guardian') as any, schoolId: dto.schoolId,
    })
    if (dto.studentIds?.length) {
      parent.students = await this.studentRepo.find({ where: { id: In(dto.studentIds) } })
    }
    return this.parentRepo.save(parent)
  }

  async update(id: string, dto: UpdateParentDto) {
    const parent = await this.findOne(id)
    if (dto.studentIds !== undefined) {
      parent.students = dto.studentIds.length > 0
        ? await this.studentRepo.find({ where: { id: In(dto.studentIds) } })
        : []
    }
    Object.assign(parent, dto)
    return this.parentRepo.save(parent)
  }

  async remove(id: string) {
    const parent = await this.findOne(id)
    return this.parentRepo.softRemove(parent)
  }

  async bindStudent(parentId: string, studentId: string) {
    const parent = await this.findOne(parentId)
    const student = await this.studentRepo.findOne({ where: { id: studentId } })
    if (!student) throw new NotFoundException('学生不存在')
    if (!parent.students) parent.students = []
    if (!parent.students.find(s => s.id === studentId)) {
      parent.students.push(student)
      await this.parentRepo.save(parent)
    }
    return parent
  }

  async unbindStudent(parentId: string, studentId: string) {
    const parent = await this.parentRepo.findOne({ where: { id: parentId }, relations: ['students'] })
    if (!parent) throw new NotFoundException('家长不存在')
    parent.students = (parent.students || []).filter(s => s.id !== studentId)
    return this.parentRepo.save(parent)
  }

  async createAccount(parentId: string, dto: CreateParentAccountDto) {
    const parent = await this.findOne(parentId)
    if (parent.userId) throw new BadRequestException('该家长已有账号')

    const existing = await this.userRepo.findOne({ where: { username: dto.username } })
    if (existing) throw new BadRequestException('用户名已存在')

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = this.userRepo.create({
      username: dto.username, password: hashedPassword, realName: parent.name,
      phone: parent.phone, email: parent.email, schoolId: parent.schoolId,
    })

    const parentRole = await this.roleRepo.findOne({ where: { code: dto.roleCode || 'parent' } })
    if (parentRole) user.roles = [parentRole]

    const savedUser = await this.userRepo.save(user)
    parent.user = savedUser
    parent.userId = savedUser.id
    await this.parentRepo.save(parent)

    return { user: savedUser, parent }
  }
}
