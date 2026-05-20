import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Student } from '../../entities/student.entity'
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto } from './dto/student.dto'

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto) {
    const clean: any = { ...dto }
    if (!clean.birthday) delete clean.birthday
    if (!clean.enrollmentDate) delete clean.enrollmentDate
    if (!clean.classId) delete clean.classId
    const student = this.studentRepo.create(clean)
    try {
      return await this.studentRepo.save(student)
    } catch (e: any) {
      if (e.code === '23505') throw new BadRequestException('学号已存在，请更换')
      throw e
    }
  }

  async findAll(query: StudentQueryDto) {
    const { keyword, classId, schoolId, status, page = 1, pageSize = 20 } = query
    const qb = this.studentRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.class', 'class')
      .leftJoinAndSelect('s.school', 'school')
      .where('s.deletedAt IS NULL')

    if (keyword) {
      qb.andWhere('(s.name LIKE :kw OR s.studentNo LIKE :kw)', { kw: `%${keyword}%` })
    }
    if (classId) qb.andWhere('s.classId = :classId', { classId })
    if (schoolId) qb.andWhere('s.schoolId = :schoolId', { schoolId })
    if (status) qb.andWhere('s.status = :status', { status })

    qb.orderBy('s.studentNo', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)

    const [list, total] = await qb.getManyAndCount()
    return { list, total, page, pageSize }
  }

  async findOne(id: string) {
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: ['class', 'school'],
    })
    if (!student) throw new NotFoundException('学生不存在')
    return student
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.studentRepo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string) {
    const student = await this.findOne(id)
    await this.studentRepo.softDelete(id)
    return { message: '删除成功' }
  }

  async importBatch(dtos: CreateStudentDto[]) {
    const students = dtos.map(dto => this.studentRepo.create(dto))
    return this.studentRepo.save(students)
  }
}
