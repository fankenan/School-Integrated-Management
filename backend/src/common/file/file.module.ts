import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileRecord } from './entities/file-record.entity'

@Module({
  imports: [TypeOrmModule.forFeature([FileRecord])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}