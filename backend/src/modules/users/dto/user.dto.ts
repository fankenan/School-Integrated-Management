import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(20, { message: '用户名最多20个字符' })
  username: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少6个字符' })
  password: string

  @ApiProperty({ description: '真实姓名' })
  @IsNotEmpty({ message: '真实姓名不能为空' })
  realName: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  avatar?: string

  @ApiProperty({ description: '状态: 1-正常 0-禁用', default: 1 })
  @IsEnum([0, 1], { message: '状态值不正确' })
  status: number

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional()
  departmentId?: string

  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  roleIds?: string[]
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(20, { message: '用户名最多20个字符' })
  username?: string

  @ApiPropertyOptional({ description: '密码' })
  @IsOptional()
  @MinLength(6, { message: '密码至少6个字符' })
  password?: string

  @ApiPropertyOptional({ description: '真实姓名' })
  @IsOptional()
  realName?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional({ description: '状态: 1-正常 0-禁用' })
  @IsOptional()
  @IsEnum([0, 1], { message: '状态值不正确' })
  status?: number

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional()
  departmentId?: string

  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  roleIds?: string[]
}

export class UserQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number

  @ApiPropertyOptional({ description: '用户名（模糊查询）' })
  @IsOptional()
  username?: string

  @ApiPropertyOptional({ description: '真实姓名（模糊查询）' })
  @IsOptional()
  realName?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsEnum([0, 1], { message: '状态值不正确' })
  status?: number

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional()
  departmentId?: string
}