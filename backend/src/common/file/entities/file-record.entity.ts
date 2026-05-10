import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('file_records')
export class FileRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255 })
  originalName: string

  @Column({ length: 100 })
  mimeType: string

  @Column()
  size: number

  @Column({ length: 500 })
  url: string

  @Column({ length: 255, nullable: true })
  storagePath?: string

  @Column({ length: 50, nullable: true })
  category?: string

  @Column({ name: 'uploader_id', type: 'uuid', nullable: true })
  uploaderId?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}