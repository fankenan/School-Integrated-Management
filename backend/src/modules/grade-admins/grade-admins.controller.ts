import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { GradeAdminsService } from './grade-admins.service'

@ApiTags('grade-admins')
@Controller('grade-admins')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class GradeAdminsController {
  constructor(private readonly service: GradeAdminsService) {}

  @Get()
  @ApiOperation({ summary: '年级管理员列表' })
  async findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 10, @Query('schoolId') schoolId?: string) {
    const result = await this.service.findAll({ page, pageSize, schoolId })
    return { code: 200, message: '获取成功', data: result }
  }

  @Get(':id')
  @ApiOperation({ summary: '年级管理员详情' })
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id)
    return { code: 200, message: '获取成功', data: result }
  }

  @Post()
  @ApiOperation({ summary: '创建年级管理员' })
  async create(@Body() dto: {
    username: string; password: string; realName: string;
    schoolId: string; gradeLevel: string; gradeName: string;
    departmentId?: string; phone?: string;
  }) {
    const result = await this.service.create(dto)
    return { code: 200, message: '创建成功', data: result }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除年级管理员' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id)
    return { code: 200, message: '删除成功', data: null }
  }
}
