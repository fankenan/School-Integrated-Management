import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GradeAdminsService } from './grade-admins.service'
import { GradeAdminsController } from './grade-admins.controller'
import { GradeAdmin } from '../../entities/grade-admin.entity'
import { User } from '../../entities/user.entity'
import { Role } from '../../entities/role.entity'
import { Department } from '../../entities/department.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GradeAdmin, User, Role, Department])],
  controllers: [GradeAdminsController],
  providers: [GradeAdminsService],
  exports: [GradeAdminsService],
})
export class GradeAdminsModule {}
