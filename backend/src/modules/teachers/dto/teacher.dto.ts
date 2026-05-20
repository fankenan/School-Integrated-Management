import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator'
import { TeacherStatus } from '../../../entities/teacher.entity'

export class CreateTeacherDto {
  @ApiProperty({ description: '工号' })
  @IsString() @MaxLength(20)
  teacherNo: string

  @ApiProperty({ description: '姓名' })
  @IsString() @MaxLength(50)
  name: string

  @ApiPropertyOptional({ description: '性别', default: 'M' })
  @IsOptional() @IsString() @MaxLength(1)
  gender?: string

  @ApiPropertyOptional({ description: '职称' })
  @IsOptional() @IsString() @MaxLength(30)
  title?: string

  @ApiPropertyOptional({ description: '任教科目' })
  @IsOptional() @IsString() @MaxLength(200)
  subjects?: string

  @ApiPropertyOptional({ description: '学历' })
  @IsOptional() @IsString() @MaxLength(20)
  education?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional() @IsString() @MaxLength(100)
  email?: string

  @ApiPropertyOptional({ description: '入职日期' })
  @IsOptional() @IsString()
  hireDate?: string

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional() @IsString()
  departmentId?: string

  @ApiPropertyOptional({ description: '部门ID列表（前端多选兼容）', type: [String] })
  @IsOptional()
  departmentIds?: string[]

  @ApiPropertyOptional({ description: '学校ID' })
  @IsOptional() @IsString()
  schoolId?: string
}

export class UpdateTeacherDto {
  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional() @IsString() @MaxLength(50)
  name?: string

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional() @IsString() @MaxLength(1)
  gender?: string

  @ApiPropertyOptional({ description: '职称' })
  @IsOptional() @IsString()
  title?: string

  @ApiPropertyOptional({ description: '任教科目' })
  @IsOptional() @IsString()
  subjects?: string

  @ApiPropertyOptional({ description: '学历' })
  @IsOptional() @IsString()
  education?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional() @IsString() @MaxLength(100)
  email?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum(TeacherStatus)
  status?: TeacherStatus

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional() @IsString()
  departmentId?: string
}

export class TeacherQueryDto {
  @ApiPropertyOptional({ description: '工号/姓名搜索' })
  @IsOptional() @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional() @IsString()
  departmentId?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum(TeacherStatus)
  status?: TeacherStatus

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: '每页条数', default: 20 })
  @IsOptional()
  pageSize?: number
}
