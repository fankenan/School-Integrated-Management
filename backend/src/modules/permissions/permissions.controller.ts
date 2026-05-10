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

import { PermissionsService } from './permissions.service'
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto'

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: '获取权限列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll() {
    const result = await this.permissionsService.findTree()
    return {
      code: 200,
      message: '获取成功',
      data: result,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取权限详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionsService.findOne(id)
    return {
      code: 200,
      message: '获取成功',
      data: permission,
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: 200, description: '创建成功' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionsService.create(createPermissionDto)
    return {
      code: 200,
      message: '创建成功',
      data: permission,
    }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionsService.update(id, updatePermissionDto)
    return {
      code: 200,
      message: '更新成功',
      data: permission,
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    await this.permissionsService.remove(id)
    return {
      code: 200,
      message: '删除成功',
    }
  }
}