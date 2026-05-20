import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Class } from '../../entities/class.entity'
import { Department } from '../../entities/department.entity'

@ApiTags('classes')
@Controller('classes')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ClassesController {
  constructor(
    @InjectRepository(Class) private readonly repo: Repository<Class>,
  ) {}

  @Get()
  @ApiOperation({ summary: '班级列表' })
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 50, @Query('keyword') keyword?: string, @Query('schoolId') schoolId?: string, @Query('grade') grade?: string) {
    const where: any = {}
    if (keyword) where.name = Like(`%${keyword}%`)
    if (schoolId) where.schoolId = schoolId
    if (grade) where.grade = grade
    const [list, total] = await this.repo.findAndCount({ where, skip: (+page - 1) * +pageSize, take: +pageSize, order: { createdAt: 'DESC' } })
    return { code: 200, message: '获取成功', data: { list, total, page, pageSize } }
  }

  @Get('all')
  @ApiOperation({ summary: '全部班级（下拉框用）' })
  async all(@Query('schoolId') schoolId?: string) {
    const where: any = {}
    if (schoolId) where.schoolId = schoolId
    const list = await this.repo.find({ where, order: { name: 'ASC' } })
    return { code: 200, message: '获取成功', data: list }
  }

  @Get(':id')
  @ApiOperation({ summary: '班级详情' })
  async findOne(@Param('id') id: string) {
    return { code: 200, message: '获取成功', data: await this.repo.findOneOrFail({ where: { id } }) }
  }

  @Post()
  @ApiOperation({ summary: '创建班级' })
  async create(@Body() dto: Partial<Class>) {
    return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新班级' })
  async update(@Param('id') id: string, @Body() dto: Partial<Class>) {
    const entity = await this.repo.findOneOrFail({ where: { id } })
    Object.assign(entity, dto)
    return { code: 200, message: '更新成功', data: await this.repo.save(entity) }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除班级' })
  async remove(@Param('id') id: string) {
    await this.repo.softRemove(await this.repo.findOneOrFail({ where: { id } }))
    return { code: 200, message: '删除成功', data: null }
  }
}
