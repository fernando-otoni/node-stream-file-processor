import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileJobEntity } from "../entities/file-jobs.entity";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";
import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";

@Injectable()
export class FileJobRepositoryImpl
  extends TypeOrmRepository<FileJobEntity>
  implements FileJobRepository {
  constructor(
    @InjectRepository(FileJobEntity)
    repository: Repository<FileJobEntity>,
    transactionContext: TransactionContext
  ) {
    super(FileJobEntity, repository, transactionContext)
  }

  getNextPendingFileJob(): Promise<FileJobEntity | null> {
    return this.getRepository()
      .createQueryBuilder('file_job')
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked')
      .innerJoinAndSelect('file_job.file', 'file')
      .where('file_job.status = :status', {
        status: FileJobStatusEnum.PENDING
      })
      .orderBy('file_job.created_at', 'DESC')
      .getOne()
  }

  getNextFailedFileJob(): Promise<FileJobEntity | null> {
    return this.getRepository()
      .createQueryBuilder('file_job')
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked')
      .innerJoinAndSelect('file_job.file', 'file')
      .where('file_job.status = :status', {
        status: FileJobStatusEnum.FAILED
      })
      .andWhere('file_job.attempts <= :attempts', {
        attempts: 4
      })
      .orderBy('file_job.created_at', 'DESC')
      .getOne()
  }

  save(job: Partial<FileJobEntity>) {
    return this.getRepository().save(job)
  }

  async getFileJobByFileId(file_id: number) {
    return this.getRepository().findOneBy({ file_id })
  }

  async update(data: Partial<FileJobEntity>, id: number) {
    await this.getRepository().update(id, {
      ...data
    })

    return await this.getRepository().findOneOrFail({
      where: { id },
    })
  }
}