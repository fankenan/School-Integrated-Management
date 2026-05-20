import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Teacher } from '../../entities/teacher.entity'
import { CreateTeacherDto, UpdateTeacherDto, TeacherQueryDto } from './dto/teacher.dto'

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async create(dto: CreateTeacherDto) {
    const clean: any = { ...dto }
    if (!clean.hireDate) delete clean.hireDate
    if (!clean.departmentId) delete clean.departmentId
    const teacher = this.teacherRepo.create(clean)
    try {
      return await this.teacherRepo.save(teacher)
    } catch (e: any) {
      if (e.code === '23505') throw new BadRequestException('工号已存在，请更换')
      throw e
    }
  }

  async findAll(query: TeacherQueryDto) {
    const { keyword, departmentId, status, page = 1, pageSize = 20 } = query
    const qb = this.teacherRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.department', 'department')
      .leftJoinAndSelect('t.school', 'school')
      .where('t.deletedAt IS NULL')

    if (keyword) qb.andWhere('(t.name LIKE :kw OR t.teacherNo LIKE :kw)', { kw: `%${keyword}%` })
    if (departmentId) qb.andWhere('t.departmentId = :departmentId', { departmentId })
    if (status) qb.andWhere('t.status = :status', { status })

    qb.orderBy('t.teacherNo', 'ASC').skip((page - 1) * pageSize).take(pageSize)
    const [list, total] = await qb.getManyAndCount()
    return { list, total, page, pageSize }
  }

  async findOne(id: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { id },
      relations: ['department', 'school'],
    })
    if (!teacher) throw new NotFoundException('教师不存在')
    return teacher
  }

  async update(id: string, dto: UpdateTeacherDto) {
    await this.teacherRepo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.teacherRepo.softDelete(id)
    return { message: '删除成功' }
  }
}
