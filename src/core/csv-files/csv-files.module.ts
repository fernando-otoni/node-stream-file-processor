import { Module } from "@nestjs/common";
import { ExtractCsvFileProcessorWorker } from "./infra/worker/extract-csv-file-processor.worker";
import { FilesModule } from "../files/files.module";
import { ExtractDataFromCsvFileUseCase } from "./application/use-cases/extract-data-from-csv-file/extract-data-from-csv-file.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CsvHeaderEntity } from "./infra/database/entities/csv-header.entity";
import { CsvRowEntity } from "./infra/database/entities/csv-row.entity";
import { CsvRowRepositoryImpl } from "./infra/database/repositories/csv-row.repository";
import { CsvRowRepository } from "./domain/repositories/csv-row.repository";
import { CsvHeaderRepository } from "./domain/repositories/csv-header.repository";
import { CsvHeadersRepositoryImpl } from "./infra/database/repositories/csv-header.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CsvHeaderEntity,
      CsvRowEntity
    ]),
    FilesModule
  ],
  controllers: [],
  providers: [
    ExtractCsvFileProcessorWorker,
    ExtractDataFromCsvFileUseCase,
    {
      provide: CsvRowRepository,
      useClass: CsvRowRepositoryImpl
    },
    {
      provide: CsvHeaderRepository,
      useClass: CsvHeadersRepositoryImpl
    }
  ],
  exports: []
})
export class CsvFilesModule { }