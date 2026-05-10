import { IsNotEmpty, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(20, { message: '用户名最多20个字符' })
  username: string

  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少6个字符' })
  password: string

  @ApiProperty({ description: '验证码', required: false })
  @IsOptional()
  captcha?: string
}

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(20, { message: '用户名最多20个字符' })
  username: string

  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少6个字符' })
  password: string

  @ApiProperty({ description: '真实姓名', example: '张三' })
  @IsNotEmpty({ message: '真实姓名不能为空' })
  realName: string

  @ApiProperty({ description: '邮箱', example: 'test@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string

  @ApiProperty({ description: '手机号', example: '13800138000', required: false })
  @IsOptional()
  phone?: string
}