import { Module } from '@nestjs/common';
import { JobQueue } from './job.queue';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entity/job.entity';
import { JobRepository } from '../../../source/core/jobs/infra/repositories/job.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
  ],
  providers: [JobQueue, JobRepository],
  exports: [JobQueue, JobRepository],
})
export class QueueModule { }