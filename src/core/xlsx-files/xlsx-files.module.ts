import { Module } from "@nestjs/common";
import { FilesModule } from "../files/files.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExtractXlsxFileProcessorWorker } from "./infra/worker/extract-xlsx-file-processor.worker";
import { ExtractDataFromXlsxFileUseCase } from "./application/use-cases/extract-data-from-xlsx-file/extract-data-from-xlsx-file.use-case";
import { XlsxWorksheetEntity } from "./infra/database/entities/xlsx-worksheet.entity";
import { XlsxHeaderEntity } from "./infra/database/entities/xlsx-header.entity";
import { XlsxRowEntity } from "./infra/database/entities/xlsx-row.entity";
import { XlsxWorksheetRepository } from "./domain/repositories/xlsx-worksheet.repository";
import { XlsxWorksheetsRepositoryImpl } from "./infra/database/repositories/xlsx-worksheet.repository";
import { XlsxHeaderRepository } from "./domain/repositories/xlsx-header.repository";
import { XlsxHeadersRepositoryImpl } from "./infra/database/repositories/xlsx-header.repository";
import { XlsxRowRepository } from "./domain/repositories/xlsx-row.repository";
import { XlsxRowRepositoryImpl } from "./infra/database/repositories/xlsx-row.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      XlsxWorksheetEntity,
      XlsxHeaderEntity,
      XlsxRowEntity
    ]),
    FilesModule
  ],
  controllers: [],
  providers: [
    ExtractXlsxFileProcessorWorker,
    ExtractDataFromXlsxFileUseCase,
    {
      provide: XlsxWorksheetRepository,
      useClass: XlsxWorksheetsRepositoryImpl
    },
    {
      provide: XlsxHeaderRepository,
      useClass: XlsxHeadersRepositoryImpl
    },
    {
      provide: XlsxRowRepository,
      useClass: XlsxRowRepositoryImpl
    }
  ],
  exports: []
})
export class XlsxFilesModule { }