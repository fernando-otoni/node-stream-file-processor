import { Injectable } from "@nestjs/common";
import { FileRepository } from "../../../domain/repositories/file.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "../entities/files.entity";
import { Repository } from "typeorm";
import { FileStatusEnum } from "src/core/files/domain/enums/file-status.enum";

@Injectable()
export class FileRepositoryImpl implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repository: Repository<FileEntity>
  ) { }

  async save(file: FileEntity): Promise<FileEntity> {
    return await this.repository.save(file)
  }

  async getFileToProcess(): Promise<FileEntity> {
    return this.repository.findOneOrFail({
      where: {
        status: FileStatusEnum.PENDING
      },
      order: {
        created_at: 'DESC'
      }
    })
  }
}