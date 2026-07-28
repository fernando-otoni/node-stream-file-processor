import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JobEntity, JobStatusEnum } from "../../../../../src/infra/queue/entity/job.entity";
import { Repository } from "typeorm";
import { JobRepository } from "../../domain/repositories/job.repository";
import { GetNextPendingJobInput } from "../../domain/repositories/contract/get-next-pending-job.input";
import { GetAllPendingJobsInput } from "../../domain/repositories/contract/get-all-pending-jobs.input";
import { GetNextFailedJobInput } from "../../domain/repositories/contract/get-next-failed-job.input";

@Injectable()
export class JobRepositoryImpl implements JobRepository {
  constructor(
    @InjectRepository(JobEntity)
    private readonly repository: Repository<JobEntity>
  ) { }

  create(data: Partial<JobEntity>) {
    const job = this.repository.create({
      ...data,
      status: JobStatusEnum.PENDING
    })

    return this.repository.save(job)
  }

  async getAllPendingJobs({
    type, 
    page = 1,
    pageSize = 25
  }: GetAllPendingJobsInput) {
    const [jobs, total] = await this.repository.findAndCount({
      where: {
        type,
        status: JobStatusEnum.PENDING
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        created_at: 'ASC'
      }
    })

    return {
      results: jobs,
      total
    }
  }

  async getNextPendingJob({
    type
  }: GetNextPendingJobInput) {
    return await this.repository.findOne({
      where: {
        type,
        status: JobStatusEnum.PENDING
      },
      order: {
        created_at: 'ASC'
      }
    })
  }

  async getNextFailedJob({
    type
  }: GetNextFailedJobInput) {
    return this.repository
      .createQueryBuilder('job')
      .where('job.type = :type', { type })
      .andWhere('job.status = :status', { status: JobStatusEnum.FAILED })
      .andWhere('job.attempts < 3')
      .andWhere(`job.finished_at < NOW() - INTERVAL '5 minutes'`)
      .orderBy('job.created_at', 'ASC')
      .getOne()
  }

  async update(data: Partial<JobEntity>, id: number) {
    await this.repository.update(id, {
      ...data
    })

    return await this.repository.findOneOrFail({
      where: { id },
    })
  }
}