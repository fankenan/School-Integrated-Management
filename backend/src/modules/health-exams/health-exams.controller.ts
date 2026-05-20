import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { HealthExamination } from '../../entities/health-examination.entity'

@ApiTags('health-exams')
@Controller('health-exams')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class HealthExamsController {
  constructor(@InjectRepository(HealthExamination) private readonly repo: Repository<HealthExamination>) {}
  @Get()
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const where: any = {}; if (keyword) where.studentName = Like(`%${keyword}%`)
    const [list, total] = await this.repo.findAndCount({ where, order: { examDate: 'DESC' }, skip: (+page - 1) * +pageSize, take: +pageSize })
    return { code: 200, message: 'OK', data: { list, total, page, pageSize } }
  }
  @Post() async create(@Body() dto: any) { return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) } }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: any) { const e = await this.repo.findOneOrFail({ where: { id } }); Object.assign(e, dto); return { code: 200, message: '更新成功', data: await this.repo.save(e) } }
  @Delete(':id') async remove(@Param('id') id: string) { await this.repo.delete(id); return { code: 200, message: '删除成功', data: null } }
}
