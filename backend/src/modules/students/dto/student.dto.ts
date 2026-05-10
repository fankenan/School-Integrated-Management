import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator'
import { StudentStatus } from '../../../entities/student.entity'

export class CreateStudentDto {
  @ApiProperty({ description: '学号' })
  @IsString() @MaxLength(20)
  studentNo: string

  @ApiProperty({ description: '姓名' })
  @IsString() @MaxLength(50)
  name: string

  @ApiPropertyOptional({ description: '性别', default: 'M' })
  @IsOptional() @IsString() @MaxLength(1)
  gender?: string

  @ApiPropertyOptional({ description: '出生日期' })
  @IsOptional() @IsDateString()
  birthday?: string

  @ApiPropertyOptional({ description: '身份证号' })
  @IsOptional() @IsString() @MaxLength(18)
  idCard?: string

  @ApiPropertyOptional({ description: '家庭住址' })
  @IsOptional() @IsString() @MaxLength(200)
  address?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ description: '监护人姓名' })
  @IsOptional() @IsString() @MaxLength(50)
  guardianName?: string

  @ApiPropertyOptional({ description: '监护人电话' })
  @IsOptional() @IsString() @MaxLength(20)
  guardianPhone?: string

  @ApiPropertyOptional({ description: '监护人关系' })
  @IsOptional() @IsString() @MaxLength(20)
  guardianRelation?: string

  @ApiPropertyOptional({ description: '入学日期' })
  @IsOptional() @IsDateString()
  enrollmentDate?: string

  @ApiPropertyOptional({ description: '班级ID' })
  @IsOptional() @IsString()
  classId?: string

  @ApiPropertyOptional({ description: '学校ID' })
  @IsOptional() @IsString()
  schoolId?: string
}

export class UpdateStudentDto {
  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional() @IsString() @MaxLength(50)
  name?: string

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional() @IsString() @MaxLength(1)
  gender?: string

  @ApiPropertyOptional({ description: '出生日期' })
  @IsOptional() @IsDateString()
  birthday?: string

  @ApiPropertyOptional({ description: '身份证号' })
  @IsOptional() @IsString() @MaxLength(18)
  idCard?: string

  @ApiPropertyOptional({ description: '家庭住址' })
  @IsOptional() @IsString()
  address?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ description: '监护人姓名' })
  @IsOptional() @IsString() @MaxLength(50)
  guardianName?: string

  @ApiPropertyOptional({ description: '监护人电话' })
  @IsOptional() @IsString() @MaxLength(20)
  guardianPhone?: string

  @ApiPropertyOptional({ description: '监护人关系' })
  @IsOptional() @IsString() @MaxLength(20)
  guardianRelation?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum(StudentStatus)
  status?: StudentStatus

  @ApiPropertyOptional({ description: '班级ID' })
  @IsOptional() @IsString()
  classId?: string
}

export class StudentQueryDto {
  @ApiPropertyOptional({ description: '学号/姓名搜索' })
  @IsOptional() @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '班级ID' })
  @IsOptional() @IsString()
  classId?: string

  @ApiPropertyOptional({ description: '学校ID' })
  @IsOptional() @IsString()
  schoolId?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum(StudentStatus)
  status?: StudentStatus

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: '每页条数', default: 20 })
  @IsOptional()
  pageSize?: number
}
