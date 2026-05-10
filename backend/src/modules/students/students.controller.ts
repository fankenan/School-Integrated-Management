import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { StudentsService } from './students.service'
import { CreateStudentDto, UpdateStudentDto, StudentQueryDto } from './dto/student.dto'

@ApiTags('学生管理')
@Controller('students')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post()
  @ApiOperation({ summary: '新增学生' })
  create(@Body() dto: CreateStudentDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '学生列表（分页+筛选）' })
  findAll(@Query() query: StudentQueryDto) {
    return this.service.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '学生详情' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新学生' })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除学生' })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }

  @Post('import')
  @ApiOperation({ summary: '批量导入学生' })
  importBatch(@Body() dtos: CreateStudentDto[]) {
    return this.service.importBatch(dtos)
  }
}
