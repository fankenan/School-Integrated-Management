import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { FileService } from './file.service'
import { CurrentUser } from '../decorators/current-user.decorator'

@ApiTags('file')
@Controller('files')
@UseGuards(AuthGuard('jwt'))
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: '文件上传' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
    @Body('category') category?: string,
  ) {
    if (!file) throw new BadRequestException('请选择要上传的文件')
    const result = await this.fileService.uploadFile(file, userId, category)
    return { code: 200, message: '上传成功', data: result }
  }
}