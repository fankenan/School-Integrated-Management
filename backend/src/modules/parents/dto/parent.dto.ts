import { IsNotEmpty, IsOptional, IsEnum, MaxLength, IsArray } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateParentDto {
  @ApiProperty({ description: '姓名' })
  @IsNotEmpty() @MaxLength(50)
  name: string

  @ApiProperty({ description: '性别', default: 'M' })
  @IsOptional()
  gender?: string

  @ApiProperty({ description: '手机号' })
  @IsNotEmpty() @MaxLength(20)
  phone: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional() @MaxLength(100)
  email?: string

  @ApiProperty({ description: '与学生的关系', default: 'guardian' })
  @IsOptional() @IsEnum(['father', 'mother', 'guardian', 'other'])
  relation?: string

  @ApiPropertyOptional({ description: '学校ID' })
  @IsOptional()
  schoolId?: string

  @ApiPropertyOptional({ description: '绑定的学生ID列表' })
  @IsOptional() @IsArray()
  studentIds?: string[]
}

export class UpdateParentDto {
  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional() @MaxLength(50)
  name?: string

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  gender?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional() @MaxLength(100)
  email?: string

  @ApiPropertyOptional({ description: '关系' })
  @IsOptional() @IsEnum(['father', 'mother', 'guardian', 'other'])
  relation?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum(['active', 'inactive'])
  status?: string

  @ApiPropertyOptional({ description: '绑定的学生ID列表' })
  @IsOptional() @IsArray()
  studentIds?: string[]
}

export class ParentQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional() @Type(() => Number)
  page?: number

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional() @Type(() => Number)
  pageSize?: number

  @ApiPropertyOptional({ description: '关键词搜索(姓名/手机)' })
  @IsOptional()
  keyword?: string

  @ApiPropertyOptional({ description: '关系' })
  @IsOptional()
  relation?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  status?: string

  @ApiPropertyOptional({ description: '学校ID' })
  @IsOptional()
  schoolId?: string
}

export class CreateParentAccountDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  username: string

  @ApiProperty({ description: '密码' })
  @IsNotEmpty() @MaxLength(20)
  password: string

  @ApiProperty({ description: '角色代码', default: 'parent' })
  @IsOptional()
  roleCode?: string
}
