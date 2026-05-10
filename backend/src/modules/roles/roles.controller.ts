import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

import { RolesService } from './roles.service'
import { CreateRoleDto, UpdateRoleDto, RoleQueryDto } from './dto/role.dto'

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Query() query: RoleQueryDto) {
    const result = await this.rolesService.findAll(query)
    return {
      code: 200,
      message: '获取成功',
      data: result,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取角色详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id)
    return {
      code: 200,
      message: '获取成功',
      data: role,
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 200, description: '创建成功' })
  @ApiResponse({ status: 400, description: '角色代码已存在' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto)
    return {
      code: 200,
      message: '创建成功',
      data: role,
    }
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.rolesService.update(id, updateRoleDto)
    return {
      code: 200,
      message: '更新成功',
      data: role,
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除角色' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    await this.rolesService.remove(id)
    return {
      code: 200,
      message: '删除成功',
    }
  }

  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '分配权限' })
  @ApiResponse({ status: 200, description: '分配成功' })
  async assignPermissions(@Param('id') id: string, @Body() body: { permissionIds: string[] }) {
    const role = await this.rolesService.assignPermissions(id, body.permissionIds)
    return {
      code: 200,
      message: '分配成功',
      data: role,
    }
  }
}