import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Grade } from '../../entities/grade.entity'

@ApiTags('grades')
@Controller('grades')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class GradesController {
  constructor(@InjectRepository(Grade) private readonly repo: Repository<Grade>) {}
  @Get()
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string, @Query('subject') subject?: string, @Query('type') type?: string) {
    const where: any = {}; if (subject) where.subject = subject; if (type) where.type = type
    const qb = this.repo.createQueryBuilder('g').leftJoinAndSelect('g.student', 's').leftJoinAndSelect('g.class', 'c')
    if (keyword) qb.andWhere('s.name LIKE :kw', { kw: `%${keyword}%` })
    if (subject) qb.andWhere('g.subject = :sub', { sub: subject })
    qb.skip((+page - 1) * +pageSize).take(+pageSize).orderBy('g.createdAt', 'DESC')
    const [list, total] = await qb.getManyAndCount()
    return { code: 200, message: 'OK', data: { list, total, page, pageSize } }
  }
  @Post() async create(@Body() dto: Partial<Grade>) { return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) } }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: Partial<Grade>) { const e = await this.repo.findOneOrFail({ where: { id } }); Object.assign(e, dto); return { code: 200, message: '更新成功', data: await this.repo.save(e) } }
  @Delete(':id') async remove(@Param('id') id: string) { await this.repo.delete(id); return { code: 200, message: '删除成功', data: null } }
}
