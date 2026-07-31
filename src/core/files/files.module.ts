import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./infra/database/entities/files.entity";
import { UploadController } from "./infra/controller/upload/upload.controller";
import { SaveFileUseCase } from "./application/use-cases/save-file/save-file.use-case";
import { FileRepositoryImpl } from "./infra/database/repositories/file.repository";
import { FileRepository } from './domain/repositories/file.repository'
@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    FilesModule
  ],
  controllers: [
    UploadController
  ],
  providers: [
    SaveFileUseCase,
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl
    }
  ],
  exports: []
})
export class FilesModule { }