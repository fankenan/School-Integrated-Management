import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassesController } from './classes.controller'
import { Class } from '../../entities/class.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [ClassesController],
})
export class ClassesModule {}
