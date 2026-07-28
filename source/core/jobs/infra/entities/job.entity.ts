import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JobStatusEnum } from "../../domain/enums/job-status.enum";
import type { JobPayload } from "../../domain/types/job-payload.type";

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string

  @Column({ type: 'jsonb' })
  payload: JobPayload

  @Column({
    type: 'enum',
    enum: JobStatusEnum
  })
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