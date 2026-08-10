import { Injectable } from "@nestjs/common";
import { FileRepository } from "../../../domain/repositories/file.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "../entities/files.entity";
import { Repository } from "typeorm";
import { FileStatusEnum } from "src/core/files/domain/enums/file-status.enum";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";
import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";

@Injectable()
export class FileRepositoryImpl
  extends TypeOrmRepository<FileEntity>
  implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    repository: Repository<FileEntity>,
    transactionContext: TransactionContext
  ) {
    super(FileEntity, repository, transactionContext)
  }

  async save(file: FileEntity): Promise<FileEntity> {
    return await this.getRepository().save(file)
  }

  async getNextPendingFile(): Promise<FileEntity | null> {
    return this.getRepository()
      .createQueryBuilder('file')
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked')
      .where('file.status = :status', {
        status: FileStatusEnum.PENDING
      })
      .orderBy('file.created_at', 'DESC')
      .getOne()
  }

  async findById(id: number): Promise<FileEntity | null> {
    return await this.getRepository().findOneBy({ id })
  }

  async findByHash(hash: string): Promise<FileEntity | null> {
    return await this.getRepository().findOneBy({ hash })
  }
}