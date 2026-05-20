import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { MentalRecord } from '../../entities/mental-record.entity'

@ApiTags('mental-records')
@Controller('mental-records')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MentalRecordsController {
  constructor(@InjectRepository(MentalRecord) private readonly repo: Repository<MentalRecord>) {}
  @Get()
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string) {
    const where: any = {}; if (keyword) where.studentName = Like(`%${keyword}%`)
    const [list, total] = await this.repo.findAndCount({ where, order: { evaluationDate: 'DESC' }, skip: (+page - 1) * +pageSize, take: +pageSize })
    return { code: 200, message: 'OK', data: { list, total, page, pageSize } }
  }
  @Post() async create(@Body() dto: any) { return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) } }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: any) { const e = await this.repo.findOneOrFail({ where: { id } }); Object.assign(e, dto); return { code: 200, message: '更新成功', data: await this.repo.save(e) } }
  @Delete(':id') async remove(@Param('id') id: string) { await this.repo.delete(id); return { code: 200, message: '删除成功', data: null } }
}
