import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileJobStatusEnum } from "src/core/files/domain/enums/file-job-status.enum";
import { FileJobEntity } from "../entities/file-jobs.entity";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";

@Injectable()
export class FileJobRepositoryImpl implements FileJobRepository {
  constructor(
    @InjectRepository(FileJobEntity)
    private readonly repository: Repository<FileJobEntity>
  ) { }

  create(data: Partial<FileJobEntity>) {
    const job = this.repository.create({
      ...data,
      status: FileJobStatusEnum.PENDING
    })

    return this.repository.save(job)
  }

  async getPendingJobs() {
    // const [jobs, total] = await this.repository.findAndCount({
    //   where: {
    //     status: JobStatusEnum.PENDING
    //   },
    //   skip: (page - 1) * pageSize,
    //   take: pageSize,
    //   order: {
    //     created_at: 'ASC'
    //   }
    // })

    return {
      results: [],
      total: 10
    }
  }

  // async getNextPendingJob({}: GetNextPendingJobInput) {
  //   return await this.repository.findOne({
  //     where: {
  //       status: JobStatusEnum.PENDING
  //     },
  //     order: {
  //       created_at: 'ASC'
  //     }
  //   })
  // }

  // async getNextFailedJob({
  //   type
  // }: GetNextFailedJobInput) {
  //   return this.repository
  //     .createQueryBuilder('job')
  //     .where('job.type = :type', { type })
  //     .andWhere('job.status = :status', { status: JobStatusEnum.FAILED })
  //     .andWhere('job.attempts < 3')
  //     .andWhere(`job.finished_at < NOW() - INTERVAL '5 minutes'`)
  //     .orderBy('job.created_at', 'ASC')
  //     .getOne()
  // }

  async update(data: Partial<FileJobEntity>, id: number) {
    await this.repository.update(id, {
      ...data
    })

    return await this.repository.findOneOrFail({
      where: { id },
    })
  }
}