import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./infra/database/entities/files.entity";
import { UploadController } from "./infra/controller/upload/upload.controller";
import { SaveFileUseCase } from "./application/use-cases/save-file/save-file.use-case";
import { FileRepositoryImpl } from "./infra/database/repositories/file.repository";
import { FileRepository } from './domain/repositories/file.repository'
import { GetFileToProcessUseCase } from "./application/use-cases/get-file-to-process/get-file-to-process.use-case";
import { FileJobEntity } from "./infra/database/entities/file-jobs.entity";
import { FileProcessingWorker } from "./infra/workers/file-processing.worker";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileEntity,
      FileJobEntity
    ]),
    FilesModule
  ],
  controllers: [
    UploadController
  ],
  providers: [
    SaveFileUseCase,
    FileProcessingWorker,
    GetFileToProcessUseCase,
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl
    }
  ],
  exports: [GetFileToProcessUseCase]
})
export class FilesModule { }