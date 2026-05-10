import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import { FileRecord } from './entities/file-record.entity'

export interface UploadResult {
  fileId: string
  url: string
  originalName: string
  size: number
  mimeType: string
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name)
  private readonly uploadDir: string

  constructor(
    @InjectRepository(FileRecord)
    private fileRepo: Repository<FileRecord>,
  ) {
    this.uploadDir = process.env.FILE_UPLOAD_DIR || path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    uploaderId?: string,
    category?: string,
  ): Promise<UploadResult> {
    const ext = path.extname(file.originalname)
    const filename = `${uuidv4()}${ext}`
    const storagePath = path.join(this.uploadDir, filename)

    await fs.promises.writeFile(storagePath, file.buffer)

    const fileRecord = this.fileRepo.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${filename}`,
      storagePath,
      category,
      uploaderId,
    })
    const saved = await this.fileRepo.save(fileRecord)

    return {
      fileId: saved.id,
      url: saved.url,
      originalName: saved.originalName,
      size: saved.size,
      mimeType: saved.mimeType,
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    const record = await this.fileRepo.findOne({ where: { id: fileId } })
    if (!record) throw new Error('文件不存在')
    return record.url
  }

  async deleteFile(fileId: string): Promise<void> {
    const record = await this.fileRepo.findOne({ where: { id: fileId } })
    if (record?.storagePath && fs.existsSync(record.storagePath)) {
      await fs.promises.unlink(record.storagePath)
    }
    await this.fileRepo.delete(fileId)
  }
}