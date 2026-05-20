import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountsController } from './accounts.controller'
import { User } from '../../entities/user.entity'
import { Role } from '../../entities/role.entity'
import { Teacher } from '../../entities/teacher.entity'
import { Parent } from '../../entities/parent.entity'
import { Staff } from '../../entities/staff.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Teacher, Parent, Staff])],
  controllers: [AccountsController],
})
export class AccountsModule {}
