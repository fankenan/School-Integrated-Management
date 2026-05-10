import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

import { DepartmentsService } from './departments.service'
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto'

@ApiTags('departments')
@Controller('departments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: '获取部门列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll() {
    const result = await this.departmentsService.findTree()
    return {
      code: 200,
      message: '获取成功',
      data: result,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取部门详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    const department = await this.departmentsService.findOne(id)
    return {
      code: 200,
      message: '获取成功',
      data: department,
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建部门' })
  @ApiResponse({ status: 200, description: '创建成功' })
  @ApiResponse({ status: 400, description: '部门代码已存在' })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const department = await this.departmentsService.create(createDepartmentDto)
    return {
      code: 200,
      message: '创建成功',
      data: department,
    }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新部门' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentsService.update(id, updateDepartmentDto)
    return {
      code: 200,
      message: '更新成功',
      data: department,
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除部门' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    await this.departmentsService.remove(id)
    return {
      code: 200,
      message: '删除成功',
    }
  }
}