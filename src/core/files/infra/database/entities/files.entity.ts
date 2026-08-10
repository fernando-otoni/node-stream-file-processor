import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
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

  @Column({ 
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
   })
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

  @Column({
    nullable: true
  })
  duplicate_of_file_id: number;

  @ManyToOne(() => FileEntity, (file) => file.duplicates, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "duplicate_of_file_id" })
  duplicate_of_file: FileEntity | null

  @OneToMany(() => FileEntity, (file) => file.duplicate_of_file)
  duplicates: FileJobEntity

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