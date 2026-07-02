import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JobEntity, JobStatusEnum } from "../entity/job.entity";
import { LessThan, MoreThan, Repository } from "typeorm";

@Injectable()
export class JobRepository {
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

  async getAllPendingJobs(filters: {
    type: string,
    page?: number,
    pageSize?: number
  }) {
    const { type, page = 1, pageSize = 25 } = filters

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

  async getNextPendingJob(filters: {
    type: string,
  }) {
    const { type } = filters

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

  async getNextFailedJob(filters: {
    type: string,
  }) {
    const { type } = filters

    return this.repository
      .createQueryBuilder('job')
      .where('job.type = :type', { type })
      .andWhere('job.status = :status', { status: JobStatusEnum.FAILED })
      .andWhere('job.attempts < 3')
      .andWhere(`job.finished_at < NOW() - INTERVAL '5 minutes'`)
      .orderBy('job.created_at', 'ASC')
      .getOne()

    // const { type } = filters
    // const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000)

    // return await this.repository.findOne({
    //   where: {
    //     type,
    //     status: JobStatusEnum.FAILED,
    //     attempts: LessThan(3),
    //     finished_at: LessThan(fiveMinutesFromNow)
    //   },
    //   order: {
    //     created_at: 'ASC'
    //   }
    // })
  }

  async update(data: Partial<JobEntity>, id: number) {
    return this.repository.update(id, {
      ...data
    })
  }
}