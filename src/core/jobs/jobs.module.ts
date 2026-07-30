import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobEntity } from "./infra/entities/job.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class JobsModule { }