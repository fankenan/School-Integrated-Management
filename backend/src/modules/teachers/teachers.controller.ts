import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { TeachersService } from './teachers.service'
import { CreateTeacherDto, UpdateTeacherDto, TeacherQueryDto } from './dto/teacher.dto'

@ApiTags('教师管理')
@Controller('teachers')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TeachersController {
  constructor(private readonly service: TeachersService) {}

  @Post()
  @ApiOperation({ summary: '新增教师' })
  create(@Body() dto: CreateTeacherDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '教师列表（分页+筛选）' })
  findAll(@Query() query: TeacherQueryDto) {
    return this.service.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '教师详情' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新教师' })
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除教师' })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
