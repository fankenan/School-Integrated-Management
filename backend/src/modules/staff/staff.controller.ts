import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { StaffService } from './staff.service'
import { CreateStaffDto, UpdateStaffDto, StaffQueryDto } from './dto/staff.dto'

@ApiTags('职工管理')
@Controller('staff')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Post()
  @ApiOperation({ summary: '新增职工' })
  create(@Body() dto: CreateStaffDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({ summary: '职工列表（分页+筛选）' })
  findAll(@Query() query: StaffQueryDto) {
    return this.service.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '职工详情' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新职工' })
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除职工' })
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
