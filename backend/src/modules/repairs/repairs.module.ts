import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RepairsController } from './repairs.controller'
import { Repair } from '../../entities/repair.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Repair])],
  controllers: [RepairsController],
})
export class RepairsModule {}
