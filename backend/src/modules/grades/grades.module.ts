import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GradesController } from './grades.controller'
import { Grade } from '../../entities/grade.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Grade])],
  controllers: [GradesController],
})
export class GradesModule {}
