import {
  IsNotEmpty, IsEmail, MinLength, MaxLength, IsOptional, IsEnum, IsArray,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty() @MinLength(3) @MaxLength(20)
  username: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty() @MinLength(6)
  password: string

  @ApiProperty({ description: '真实姓名' })
  @IsNotEmpty()
  realName: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional() @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  avatar?: string

  @ApiProperty({ description: '状态: 1-正常 0-禁用', default: 1 })
  @IsEnum([0, 1])
  status: number

  @ApiPropertyOptional({ description: '部门ID列表（多选）', type: [String] })
  @IsOptional() @IsArray()
  departmentIds?: string[]

  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsOptional() @IsArray()
  roleIds?: string[]
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional() @MinLength(3) @MaxLength(20)
  username?: string

  @ApiPropertyOptional({ description: '密码' })
  @IsOptional() @MinLength(6)
  password?: string

  @ApiPropertyOptional({ description: '真实姓名' })
  @IsOptional()
  realName?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional() @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional({ description: '状态: 1-正常 0-禁用' })
  @IsOptional() @IsEnum([0, 1])
  status?: number

  @ApiPropertyOptional({ description: '部门ID列表（多选）', type: [String] })
  @IsOptional() @IsArray()
  departmentIds?: string[]

  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsOptional() @IsArray()
  roleIds?: string[]
}

export class UserQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional() @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional() @Type(() => Number)
  pageSize?: number

  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  username?: string

  @ApiPropertyOptional({ description: '真实姓名' })
  @IsOptional()
  realName?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum([0, 1])
  status?: number

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional()
  departmentId?: string
}
