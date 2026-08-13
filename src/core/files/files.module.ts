import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./infra/database/entities/files.entity";
import { UploadController } from "./infra/controller/upload/upload.controller";
import { SaveFileUseCase } from "./application/use-cases/file/save-file/save-file.use-case";
import { FileRepositoryImpl } from "./infra/database/repositories/file.repository";
import { FileRepository } from './domain/repositories/file.repository'
import { FileJobEntity } from "./infra/database/entities/file-jobs.entity";
import { FileSchedulerWorker } from "./infra/worker/file-scheduler.worker";
import { FileJobRepository } from "./domain/repositories/file-job.repository";
import { FileJobRepositoryImpl } from "./infra/database/repositories/file-job.repository";
import { SetFileToQueuedUseCase } from "./application/use-cases/file/set-file-to-queued/set-file-to-queued.use-case";
import { SharedModule } from "../shared/shared.module";
import { FileJobProcessorWorker } from "./infra/worker/file-job-processor.worker";
import { SimulacaoFinanciamentoUseCase } from "./application/use-cases/simulacao-financiamento/simulacao-financiamento.use-case";
import { GenerateJobFileHashUseCase } from "./application/use-cases/file-job/generate-job-file-hash/generate-job-file-hash.use-case";
import { FailedFileJobProcessor } from "./infra/worker/failed-file-job-processor.worker";
import ClaimNextFailedJobUseCase from "./application/use-cases/file-job/claim-and-set-file-job-to-processing/claim-and-set-file-job-to-processing.use-case";
import ClaimAndSetFileJobToProcessingUseCase from "./application/use-cases/file-job/claim-and-set-file-job-to-processing/claim-and-set-file-job-to-processing.use-case";
import { ProcessFileJobUseCase } from "./application/use-cases/file-job/process-file-job/process-file-job.use-case";
import { ModulesModule } from "src/modules/modules.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileEntity,
      FileJobEntity
    ]),
    FilesModule,
    SharedModule,
    ModulesModule
  ],
  controllers: [
    UploadController
  ],
  providers: [
    SaveFileUseCase,
    FileSchedulerWorker,
    ClaimAndSetFileJobToProcessingUseCase,
    SetFileToQueuedUseCase,
    FileJobProcessorWorker,
    ProcessFileJobUseCase,
    SimulacaoFinanciamentoUseCase,
    GenerateJobFileHashUseCase,
    FailedFileJobProcessor,
    ClaimNextFailedJobUseCase,
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl
    },
    {
      provide: FileJobRepository,
      useClass: FileJobRepositoryImpl
    }
  ],
  exports: [ClaimAndSetFileJobToProcessingUseCase]
})
export class FilesModule { }