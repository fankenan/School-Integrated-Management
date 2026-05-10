import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator'
import { StaffStatus } from '../../../entities/staff.entity'

export class CreateStaffDto {
  @ApiProperty({ description: '工号' })
  @IsString() @MaxLength(20)
  staffNo: string

  @ApiProperty({ description: '姓名' })
  @IsString() @MaxLength(50)
  name: string

  @ApiPropertyOptional({ description: '性别', default: 'M' })
  @IsOptional() @IsString() @MaxLength(1)
  gender?: string

  @ApiPropertyOptional({ description: '岗位' })
  @IsOptional() @IsString() @MaxLength(50)
  position?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ description: '入职日期' })
  @IsOptional() @IsDateString()
  hireDate?: string

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional() @IsString()
  departmentId?: string

  @ApiPropertyOptional({ description: '学校ID' })
  @IsOptional() @IsString()
  schoolId?: string
}

export class UpdateStaffDto {
  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional() @IsString() @MaxLength(50)
  name?: string

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional() @IsString() @MaxLength(1)
  gender?: string

  @ApiPropertyOptional({ description: '岗位' })
  @IsOptional() @IsString()
  position?: string

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum(StaffStatus)
  status?: StaffStatus

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional() @IsString()
  departmentId?: string
}

export class StaffQueryDto {
  @ApiPropertyOptional({ description: '工号/姓名搜索' })
  @IsOptional() @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '岗位' })
  @IsOptional() @IsString()
  position?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional() @IsEnum(StaffStatus)
  status?: StaffStatus

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: '每页条数', default: 20 })
  @IsOptional()
  pageSize?: number
}
