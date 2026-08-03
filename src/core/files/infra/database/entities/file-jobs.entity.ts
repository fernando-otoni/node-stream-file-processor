import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { FileEntity } from "./files.entity";

@Entity('file-jobs')
export class FileJobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FileJobStatusEnum
  })
  status: FileJobStatusEnum

  @Column({ default: 0 })
  attempts: number

  @Column({ type: 'text', nullable: true })
  error: Record<string, any>

  @ManyToOne(() => FileEntity, (file) => file.jobs, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "file_id" })
  file: FileEntity

  @Column()
  file_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finished_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}