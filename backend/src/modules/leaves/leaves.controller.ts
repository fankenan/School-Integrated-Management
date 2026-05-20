import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Leave } from '../../entities/leave.entity'

@ApiTags('leaves')
@Controller('leaves')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class LeavesController {
  constructor(@InjectRepository(Leave) private readonly repo: Repository<Leave>) {}
  @Get()
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 20, @Query('keyword') keyword?: string, @Query('status') status?: string) {
    const qb = this.repo.createQueryBuilder('l').leftJoinAndSelect('l.student', 's')
    const [list, total] = await qb.skip((+page - 1) * +pageSize).take(+pageSize).orderBy('l.createdAt', 'DESC').getManyAndCount()
    return { code: 200, message: 'OK', data: { list, total, page, pageSize } }
  }
  @Post() async create(@Body() dto: Partial<Leave>) { return { code: 200, message: '创建成功', data: await this.repo.save(this.repo.create(dto)) } }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: Partial<Leave>) { const e = await this.repo.findOneOrFail({ where: { id } }); Object.assign(e, dto); return { code: 200, message: '更新成功', data: await this.repo.save(e) } }
  @Delete(':id') async remove(@Param('id') id: string) { await this.repo.delete(id); return { code: 200, message: '删除成功', data: null } }
}
