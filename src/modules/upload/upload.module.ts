import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadEntity } from "./infra/database/entity/upload.entity";
import { Module } from "@nestjs/common";
import { UploadController } from "./infra/controller/upload.controller";
import { UploadService } from "./service/upload.service";
import { QueueModule } from "src/infra/queue/queue.module";
import { UploadRepository } from "./infra/database/repository/upload.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadEntity]),
    QueueModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
  exports: [UploadRepository]
})
export class UploadModule { }