import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Repair } from '../../entities/repair.entity'

@ApiTags('repairs')
@Controller('repairs')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RepairsController {
  constructor(@InjectRepository(Repair) private readonly repo: Repository<Repair>) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string, @Query('status') status?: string) {
    const where: any = {}
    if (keyword) where.description = Like(`%${keyword}%`)
    if (status) where.status = status
    const [list, total] = await this.repo.findAndCount({ where, order: { createdAt: 'DESC' }, skip: (+page - 1) * +pageSize, take: +pageSize })
    return { code: 200, message: '获取成功', data: { list, total, page, pageSize } }
  }

  @Post()
  async create(@Body() dto: Partial<Repair>) {
    return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<Repair>) {
    const entity = await this.repo.findOneOrFail({ where: { id } })
    Object.assign(entity, dto)
    return { code: 200, message: '更新成功', data: await this.repo.save(entity) }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.delete(id)
    return { code: 200, message: '删除成功', data: null }
  }
}
