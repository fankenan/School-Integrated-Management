import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ParentsService } from './parents.service'
import { ParentsController } from './parents.controller'
import { Parent } from '../../entities/parent.entity'
import { Student } from '../../entities/student.entity'
import { User } from '../../entities/user.entity'
import { Role } from '../../entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Parent, Student, User, Role])],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}
