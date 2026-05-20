import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SchoolsController } from './schools.controller'
import { School } from '../../entities/school.entity'

@Module({
  imports: [TypeOrmModule.forFeature([School])],
  controllers: [SchoolsController],
})
export class SchoolsModule {}
