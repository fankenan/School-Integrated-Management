import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { ParentsService } from './parents.service'
import { CreateParentDto, UpdateParentDto, ParentQueryDto, CreateParentAccountDto } from './dto/parent.dto'

@ApiTags('parents')
@Controller('parents')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get()
  @ApiOperation({ summary: '家长列表' })
  async findAll(@Query() query: ParentQueryDto) {
    const result = await this.parentsService.findAll(query)
    return { code: 200, message: '获取成功', data: result }
  }

  @Get(':id')
  @ApiOperation({ summary: '家长详情' })
  async findOne(@Param('id') id: string) {
    const parent = await this.parentsService.findOne(id)
    return { code: 200, message: '获取成功', data: parent }
  }

  @Post()
  @ApiOperation({ summary: '创建家长' })
  async create(@Body() dto: CreateParentDto) {
    const parent = await this.parentsService.create(dto)
    return { code: 200, message: '创建成功', data: parent }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新家长' })
  async update(@Param('id') id: string, @Body() dto: UpdateParentDto) {
    const parent = await this.parentsService.update(id, dto)
    return { code: 200, message: '更新成功', data: parent }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除家长' })
  async remove(@Param('id') id: string) {
    await this.parentsService.remove(id)
    return { code: 200, message: '删除成功', data: null }
  }

  @Post(':id/bind-student/:studentId')
  @ApiOperation({ summary: '绑定学生' })
  async bindStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    const parent = await this.parentsService.bindStudent(id, studentId)
    return { code: 200, message: '绑定成功', data: parent }
  }

  @Delete(':id/unbind-student/:studentId')
  @ApiOperation({ summary: '解绑学生' })
  async unbindStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    const parent = await this.parentsService.unbindStudent(id, studentId)
    return { code: 200, message: '解绑成功', data: parent }
  }

  @Post(':id/account')
  @ApiOperation({ summary: '为家长创建登录账号' })
  async createAccount(@Param('id') id: string, @Body() dto: CreateParentAccountDto) {
    const result = await this.parentsService.createAccount(id, dto)
    return { code: 200, message: '账号创建成功', data: result }
  }
}
