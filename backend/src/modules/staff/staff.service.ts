import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Staff } from '../../entities/staff.entity'
import { CreateStaffDto, UpdateStaffDto, StaffQueryDto } from './dto/staff.dto'

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  async create(dto: CreateStaffDto) {
    const clean: any = { ...dto }
    if (!clean.hireDate) delete clean.hireDate
    if (!clean.departmentId) delete clean.departmentId
    const staff = this.staffRepo.create(clean)
    return this.staffRepo.save(staff)
  }

  async findAll(query: StaffQueryDto) {
    const { keyword, position, status, page = 1, pageSize = 20 } = query
    const qb = this.staffRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.department', 'department')
      .leftJoinAndSelect('s.school', 'school')
      .where('s.deletedAt IS NULL')

    if (keyword) qb.andWhere('(s.name LIKE :kw OR s.staffNo LIKE :kw)', { kw: `%${keyword}%` })
    if (position) qb.andWhere('s.position = :position', { position })
    if (status) qb.andWhere('s.status = :status', { status })

    qb.orderBy('s.staffNo', 'ASC').skip((page - 1) * pageSize).take(pageSize)
    const [list, total] = await qb.getManyAndCount()
    return { list, total, page, pageSize }
  }

  async findOne(id: string) {
    const staff = await this.staffRepo.findOne({
      where: { id },
      relations: ['department', 'school'],
    })
    if (!staff) throw new NotFoundException('职工不存在')
    return staff
  }

  async update(id: string, dto: UpdateStaffDto) {
    await this.staffRepo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.staffRepo.softDelete(id)
    return { message: '删除成功' }
  }
}
