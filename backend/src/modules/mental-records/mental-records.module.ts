import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MentalRecordsController } from './mental-records.controller'
import { MentalRecord } from '../../entities/mental-record.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MentalRecord])],
  controllers: [MentalRecordsController],
})
export class MentalRecordsModule {}
