import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileJobEntity } from "../entities/file-jobs.entity";
import { ClaimQuery, FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";
import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";
import { AppConfigProvider } from "src/modules/config/app-config.interface";

@Injectable()
export class FileJobRepositoryImpl
  extends TypeOrmRepository<FileJobEntity>
  implements FileJobRepository {
  constructor(
    @InjectRepository(FileJobEntity)
    repository: Repository<FileJobEntity>,
    transactionContext: TransactionContext,
    private readonly appConfig: AppConfigProvider

  ) {
    super(FileJobEntity, repository, transactionContext)
  }

  claimFileJobByStatus({ status, type, file_mimetype }: ClaimQuery): Promise<FileJobEntity | null> {
    const query = this.getRepository()
      .createQueryBuilder('file_job')
      .setLock('pessimistic_write')
      .setOnLocked('skip_locked')
      .innerJoinAndSelect('file_job.file', 'file')
      .where('file_job.status = :status', {
        status
      })
      .andWhere('file_job.type <= :type', {
        type
      })
      .andWhere('file_job.attempts <= :attempts', {
        attempts: this.appConfig.fileJobMaxAttempts
      })
    
    
    if(file_mimetype?.length) {
      query.andWhere('file.mimetype IN (:...file_mimetype)', {
        file_mimetype
      })
    }

    return query
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