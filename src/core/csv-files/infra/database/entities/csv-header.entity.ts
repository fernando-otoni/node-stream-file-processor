import { FileEntity } from "src/core/files/infra/database/entities/files.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('csv_headers')
export class CsvHeaderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FileEntity, (file) => file.csv_headers, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "file_id" })
  file: FileEntity

  @Column()
  file_id: number;

  @Column({ 
    length: 64, 
    nullable: false 
  })
  name: string;

  @Column({ 
    type: 'int',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  index: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | undefined;
}