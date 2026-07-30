import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FileStatusEnum } from "../../../domain/enums/file-status.enum";

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  original_name: string;

  @Column({
    type: 'enum',
    enum: FileStatusEnum,
    length: 30
  })
  status: FileStatusEnum;

  @Column({ nullable: true })
  storage_path: string;

  @Column('bigint')
  size: number;

  @Column()
  mimetype: string;

  @Column({ length: 64, nullable: true })
  hash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}