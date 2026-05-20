import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthExamsController } from './health-exams.controller'
import { HealthExamination } from '../../entities/health-examination.entity'

@Module({
  imports: [TypeOrmModule.forFeature([HealthExamination])],
  controllers: [HealthExamsController],
})
export class HealthExamsModule {}
