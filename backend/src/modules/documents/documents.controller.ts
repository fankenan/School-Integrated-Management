import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Document } from '../../entities/document.entity'

@ApiTags('documents')
@Controller('documents')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DocumentsController {
  constructor(@InjectRepository(Document) private readonly repo: Repository<Document>) {}
  @Get()
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string, @Query('type') type?: string, @Query('status') status?: string) {
    const where: any = {}; if (keyword) where.title = Like(`%${keyword}%`); if (type) where.type = type; if (status) where.status = status
    const [list, total] = await this.repo.findAndCount({ where, order: { createdAt: 'DESC' }, skip: (+page - 1) * +pageSize, take: +pageSize })
    return { code: 200, message: 'OK', data: { list, total, page, pageSize } }
  }
  @Post() async create(@Body() dto: Partial<Document>) { return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) } }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: Partial<Document>) { const e = await this.repo.findOneOrFail({ where: { id } }); Object.assign(e, dto); return { code: 200, message: '更新成功', data: await this.repo.save(e) } }
  @Delete(':id') async remove(@Param('id') id: string) { await this.repo.delete(id); return { code: 200, message: '删除成功', data: null } }
}
