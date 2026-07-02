import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UploadStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  HASHED = 'HASHED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Entity('uploads')
export class UploadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: true })
  hash: string;

  @Column()
  original_name: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  storage_path: string;

  @Column('bigint')
  size: number;

  @Column({ length: 20 })
  status: UploadStatusEnum;

  @Column()
  mimetype: string;

  //timezone
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}