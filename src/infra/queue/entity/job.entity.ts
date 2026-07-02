import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum JobStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

interface JobPayload {
  path: string
  size: number
  encoding: string
  filename: string
  mimetype: string
  fieldname: string
  destination: string
  originalname: string
}

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string

  @Column({ type: 'jsonb' })
  payload: JobPayload

  @Column()
  status: JobStatusEnum

  @Column({ default: 0 })
  attempts: number

  @Column({ type: 'text', nullable: true })
  error: Record<string, any>

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finished_at: Date;
}