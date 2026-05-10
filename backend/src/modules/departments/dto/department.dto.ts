import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateDepartmentDto {
  @ApiProperty({ description: '部门名称' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  @MaxLength(50, { message: '部门名称最多50个字符' })
  name: string

  @ApiProperty({ description: '部门代码' })
  @IsNotEmpty({ message: '部门代码不能为空' })
  @MaxLength(50, { message: '部门代码最多50个字符' })
  code: string

  @ApiPropertyOptional({ description: '部门描述' })
  @IsOptional()
  description?: string

  @ApiProperty({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort: number

  @ApiPropertyOptional({ description: '负责人' })
  @IsOptional()
  @MaxLength(50, { message: '负责人最多50个字符' })
  leader?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @MaxLength(20, { message: '联系电话最多20个字符' })
  phone?: string

  @ApiProperty({ description: '状态: 1-正常 0-禁用', default: 1 })
  @IsEnum([0, 1], { message: '状态值不正确' })
  status: number

  @ApiPropertyOptional({ description: '父部门ID' })
  @IsOptional()
  parentId?: string
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional({ description: '部门名称' })
  @IsOptional()
  @MaxLength(50, { message: '部门名称最多50个字符' })
  name?: string

  @ApiPropertyOptional({ description: '部门代码' })
  @IsOptional()
  @MaxLength(50, { message: '部门代码最多50个字符' })
  code?: string

  @ApiPropertyOptional({ description: '部门描述' })
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number

  @ApiPropertyOptional({ description: '负责人' })
  @IsOptional()
  @MaxLength(50, { message: '负责人最多50个字符' })
  leader?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @MaxLength(20, { message: '联系电话最多20个字符' })
  phone?: string

  @ApiPropertyOptional({ description: '状态: 1-正常 0-禁用' })
  @IsOptional()
  @IsEnum([0, 1], { message: '状态值不正确' })
  status?: number

  @ApiPropertyOptional({ description: '父部门ID' })
  @IsOptional()
  parentId?: string
}