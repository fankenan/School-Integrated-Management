import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { User } from '../../entities/user.entity'
import { Role } from '../../entities/role.entity'
import { Teacher } from '../../entities/teacher.entity'
import { Parent } from '../../entities/parent.entity'
import { Staff } from '../../entities/staff.entity'
import * as bcrypt from 'bcryptjs'

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AccountsController {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Parent) private readonly parentRepo: Repository<Parent>,
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
  ) {}

  @Get('teachers')
  @ApiOperation({ summary: '教师账号列表' })
  async listTeacherAccounts(@Query('page') page = 1, @Query('pageSize') pageSize = 10, @Query('keyword') keyword?: string) {
    const qb = this.teacherRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.department', 'd')
      .where('1=1')
    if (keyword) qb.andWhere('(t.name LIKE :kw OR t.teacherNo LIKE :kw)', { kw: `%${keyword}%` })
    qb.skip((+page - 1) * +pageSize).take(+pageSize).orderBy('t.createdAt', 'DESC')
    const [list, total] = await qb.getManyAndCount()
    return { code: 200, message: '获取成功', data: { list, total, page, pageSize } }
  }

  @Get('parents')
  @ApiOperation({ summary: '家长账号列表' })
  async listParentAccounts(@Query('page') page = 1, @Query('pageSize') pageSize = 10, @Query('keyword') keyword?: string) {
    const qb = this.parentRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.students', 's')
      .leftJoinAndSelect('p.user', 'u')
      .where('1=1')
    if (keyword) qb.andWhere('(p.name LIKE :kw OR p.phone LIKE :kw)', { kw: `%${keyword}%` })
    qb.skip((+page - 1) * +pageSize).take(+pageSize).orderBy('p.createdAt', 'DESC')
    const [list, total] = await qb.getManyAndCount()
    return { code: 200, message: '获取成功', data: { list, total, page, pageSize } }
  }

  @Get('staff')
  @ApiOperation({ summary: '职工账号列表' })
  async listStaffAccounts(@Query('page') page = 1, @Query('pageSize') pageSize = 10, @Query('keyword') keyword?: string) {
    const qb = this.staffRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.department', 'd')
      .where('1=1')
    if (keyword) qb.andWhere('(s.name LIKE :kw OR s.staffNo LIKE :kw)', { kw: `%${keyword}%` })
    qb.skip((+page - 1) * +pageSize).take(+pageSize).orderBy('s.createdAt', 'DESC')
    const [list, total] = await qb.getManyAndCount()
    return { code: 200, message: '获取成功', data: { list, total, page, pageSize } }
  }

  @Post('create-for-teacher/:teacherId')
  @ApiOperation({ summary: '为教师创建账号' })
  async createTeacherAccount(
    @Param('teacherId') teacherId: string,
    @Body() body: { username: string; password: string; roleCode?: string },
  ) {
    const teacher = await this.teacherRepo.findOne({ where: { id: teacherId } })
    if (!teacher) throw new Error('教师不存在')

    const existing = await this.userRepo.findOne({ where: { username: body.username } })
    if (existing) throw new Error('用户名已存在')

    const hashed = await bcrypt.hash(body.password, 10)
    const user = this.userRepo.create({
      username: body.username, password: hashed, realName: teacher.name,
      phone: teacher.phone, email: teacher.email, schoolId: teacher.schoolId,
      departmentId: teacher.departmentId,
    })

    const role = await this.roleRepo.findOne({ where: { code: body.roleCode || 'teacher' } })
    if (role) user.roles = [role]

    const saved = await this.userRepo.save(user)
    return { code: 200, message: '账号创建成功', data: saved }
  }

  @Post('create-for-staff/:staffId')
  @ApiOperation({ summary: '为职工创建账号' })
  async createStaffAccount(
    @Param('staffId') staffId: string,
    @Body() body: { username: string; password: string; roleCode?: string },
  ) {
    const staff = await this.staffRepo.findOne({ where: { id: staffId } })
    if (!staff) throw new Error('职工不存在')

    const existing = await this.userRepo.findOne({ where: { username: body.username } })
    if (existing) throw new Error('用户名已存在')

    const hashed = await bcrypt.hash(body.password, 10)
    const user = this.userRepo.create({
      username: body.username, password: hashed, realName: staff.name,
      phone: staff.phone, schoolId: staff.schoolId, departmentId: staff.departmentId,
    })

    const role = await this.roleRepo.findOne({ where: { code: body.roleCode || 'staff_role' } })
    if (role) user.roles = [role]

    const saved = await this.userRepo.save(user)
    return { code: 200, message: '账号创建成功', data: saved }
  }

  @Put(':userId/roles')
  @ApiOperation({ summary: '分配用户角色' })
  async assignRoles(@Param('userId') userId: string, @Body() body: { roleIds: string[] }) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['roles'] })
    if (!user) throw new Error('用户不存在')
    const roles = await this.roleRepo.find({ where: { id: In(body.roleIds) } })
    user.roles = roles
    const saved = await this.userRepo.save(user)
    return { code: 200, message: '角色分配成功', data: saved }
  }

  @Post(':userId/reset-password')
  @ApiOperation({ summary: '重置密码' })
  async resetPassword(@Param('userId') userId: string, @Body() body: { newPassword: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new Error('用户不存在')
    user.password = await bcrypt.hash(body.newPassword, 10)
    await this.userRepo.save(user)
    return { code: 200, message: '密码重置成功', data: null }
  }

  @Get('roles')
  @ApiOperation({ summary: '获取所有可用角色' })
  async getRoles() {
    const roles = await this.roleRepo.find({ relations: ['permissions'] })
    return { code: 200, message: '获取成功', data: roles }
  }
}
