import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreatePermissionDto {
  @ApiProperty({ description: '权限名称' })
  @IsNotEmpty({ message: '权限名称不能为空' })
  @MaxLength(50, { message: '权限名称最多50个字符' })
  name: string

  @ApiProperty({ description: '权限代码' })
  @IsNotEmpty({ message: '权限代码不能为空' })
  @MaxLength(100, { message: '权限代码最多100个字符' })
  code: string

  @ApiProperty({ description: '权限类型: menu-菜单, button-按钮, api-接口' })
  @IsEnum(['menu', 'button', 'api'], { message: '权限类型不正确' })
  type: string

  @ApiPropertyOptional({ description: '父权限ID' })
  @IsOptional()
  parentId?: string

  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  path?: string

  @ApiPropertyOptional({ description: '组件路径' })
  @IsOptional()
  component?: string

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  icon?: string

  @ApiProperty({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort: number

  @ApiProperty({ description: '状态: 1-正常 0-禁用', default: 1 })
  @IsEnum([0, 1], { message: '状态值不正确' })
  status: number

  @ApiProperty({ description: '是否可见: 1-可见 0-隐藏', default: 1 })
  @IsEnum([0, 1], { message: '可见性值不正确' })
  visible: number
}

export class UpdatePermissionDto {
  @ApiPropertyOptional({ description: '权限名称' })
  @IsOptional()
  @MaxLength(50, { message: '权限名称最多50个字符' })
  name?: string

  @ApiPropertyOptional({ description: '权限代码' })
  @IsOptional()
  @MaxLength(100, { message: '权限代码最多100个字符' })
  code?: string

  @ApiPropertyOptional({ description: '权限类型: menu-菜单, button-按钮, api-接口' })
  @IsOptional()
  @IsEnum(['menu', 'button', 'api'], { message: '权限类型不正确' })
  type?: string

  @ApiPropertyOptional({ description: '父权限ID' })
  @IsOptional()
  parentId?: string

  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  path?: string

  @ApiPropertyOptional({ description: '组件路径' })
  @IsOptional()
  component?: string

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  icon?: string

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number

  @ApiPropertyOptional({ description: '状态: 1-正常 0-禁用' })
  @IsOptional()
  @IsEnum([0, 1], { message: '状态值不正确' })
  status?: number

  @ApiPropertyOptional({ description: '是否可见: 1-可见 0-隐藏' })
  @IsOptional()
  @IsEnum([0, 1], { message: '可见性值不正确' })
  visible?: number
}