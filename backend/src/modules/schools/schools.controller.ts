import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { School } from '../../entities/school.entity'

@ApiTags('schools')
@Controller('schools')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SchoolsController {
  constructor(@InjectRepository(School) private readonly repo: Repository<School>) {}

  @Get()
  @ApiOperation({ summary: '学校列表' })
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 50, @Query('keyword') keyword?: string) {
    const where: any = {}
    if (keyword) where.name = Like(`%${keyword}%`)
    const [list, total] = await this.repo.findAndCount({ where, skip: (+page - 1) * +pageSize, take: +pageSize, order: { createdAt: 'DESC' } })
    return { code: 200, message: '获取成功', data: { list, total, page, pageSize } }
  }

  @Get('all')
  @ApiOperation({ summary: '全部学校（下拉框用）' })
  async all() {
    const list = await this.repo.find({ where: { status: 1 }, order: { createdAt: 'ASC' } })
    return { code: 200, message: '获取成功', data: list }
  }

  @Get(':id')
  @ApiOperation({ summary: '学校详情' })
  async findOne(@Param('id') id: string) {
    return { code: 200, message: '获取成功', data: await this.repo.findOneOrFail({ where: { id } }) }
  }

  @Post()
  @ApiOperation({ summary: '创建学校' })
  async create(@Body() dto: Partial<School>) {
    return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新学校' })
  async update(@Param('id') id: string, @Body() dto: Partial<School>) {
    const school = await this.repo.findOneOrFail({ where: { id } })
    Object.assign(school, dto)
    return { code: 200, message: '更新成功', data: await this.repo.save(school) }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除学校' })
  async remove(@Param('id') id: string) {
    await this.repo.softRemove(await this.repo.findOneOrFail({ where: { id } }))
    return { code: 200, message: '删除成功', data: null }
  }
}
