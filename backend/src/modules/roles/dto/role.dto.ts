import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @MaxLength(50, { message: '角色名称最多50个字符' })
  name: string

  @ApiProperty({ description: '角色代码' })
  @IsNotEmpty({ message: '角色代码不能为空' })
  @MaxLength(50, { message: '角色代码最多50个字符' })
  code: string

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  description?: string

  @ApiProperty({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  sort: number

  @ApiProperty({ description: '状态: 1-正常 0-禁用', default: 1 })
  @IsEnum([0, 1], { message: '状态值不正确' })
  status: number

  @ApiPropertyOptional({ description: '权限ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  permissionIds?: string[]
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @MaxLength(50, { message: '角色名称最多50个字符' })
  name?: string

  @ApiPropertyOptional({ description: '角色代码' })
  @IsOptional()
  @MaxLength(50, { message: '角色代码最多50个字符' })
  code?: string

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @Type(() => Number)
  sort?: number

  @ApiPropertyOptional({ description: '状态: 1-正常 0-禁用' })
  @IsOptional()
  @IsEnum([0, 1], { message: '状态值不正确' })
  status?: number

  @ApiPropertyOptional({ description: '权限ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  permissionIds?: string[]
}

export class RoleQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number

  @ApiPropertyOptional({ description: '角色名称（模糊查询）' })
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsEnum([0, 1], { message: '状态值不正确' })
  status?: number
}