import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./infra/database/entities/files.entity";
import { UploadController } from "./infra/controller/upload/upload.controller";
import { SaveFileUseCase } from "./application/use-cases/save-file/save-file.use-case";
import { FileRepositoryImpl } from "./infra/database/repositories/file.repository";
import { FileRepository } from './domain/repositories/file.repository'
import { GetNextPendingFile } from "./application/use-cases/get-next-pending-file/get-next-pending-file.use-case";
import { FileJobEntity } from "./infra/database/entities/file-jobs.entity";
import { FileSchedulerWorker } from "./infra/workers/file-scheduler.worker";
import { FileJobRepository } from "./domain/repositories/file-job.repository";
import { FileJobRepositoryImpl } from "./infra/database/repositories/file-job.repository";
import { SetFileToQueuedUseCase } from "./application/use-cases/set-file-to-queued/set-file-to-queued.use-case";
import { SharedModule } from "../shared/shared.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileEntity,
      FileJobEntity
    ]),
    FilesModule,
    SharedModule
  ],
  controllers: [
    UploadController
  ],
  providers: [
    SaveFileUseCase,
    FileSchedulerWorker,
    GetNextPendingFile,
    SetFileToQueuedUseCase,
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl
    },
    {
      provide: FileJobRepository,
      useClass: FileJobRepositoryImpl
    }
  ],
  exports: [GetNextPendingFile]
})
export class FilesModule { }