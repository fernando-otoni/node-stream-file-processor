import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { FileStatusEnum } from "../../../domain/enums/file-status.enum";
import { FileJobEntity } from "./file-jobs.entity";

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  field_name: string;

  @Column()
  original_name: string;

  @Column()
  encoding: string;

  @Column()
  mimetype: string;

  @Column()
  path: string;

  @Column()
  destination: string;

  @Column()
  file_name: string;

  @Column('bigint')
  size: number;

  @Column({ 
    length: 64, 
    nullable: true 
  })
  hash: string;

  @Column({
    type: 'enum',
    enum: FileStatusEnum
  })
  status: FileStatusEnum;

  @OneToOne(() => FileJobEntity, (job) => job.file)
  jobs: FileJobEntity

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ 
    type: 'timestamptz', 
    nullable: true 
  })
  deleted_at: Date | undefined;
}