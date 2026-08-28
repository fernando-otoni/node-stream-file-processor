import { Global, Module } from "@nestjs/common";
import { TransactionContext } from "./infra/persistence/typeorm/transaction/transaction-context";
import { TypeOrmUnitOfWork } from "./infra/persistence/typeorm/transaction/typeorm-unit-of-work";
import { UnitOfWork } from "./application/unit-of-work.interface";
import { LoggerProvider } from "./application/logger.interface";
import { AppLoggerImpl } from "./infra/logger/app-logger";
import { ModulesModule } from "src/modules/modules.module";
import { SystemMetricsProvider } from "./application/system-metrics.provider";
import { SystemMetricsImpl } from "./infra/metrics/system-metrics";
import { CsvExtractor } from "./infra/file-extractor/mimetypes/csv.extractor";
import { FileExtractor } from "./application/file-extractor.interface";
import { FILE_EXTRACTORS } from "./infra/file-extractor/file-extractor.token";
import { FileExtractorFactory } from "./infra/file-extractor/file-extractor.strategy";

@Global()
@Module({
  imports: [
    ModulesModule
  ],
  providers: [
    TransactionContext,
    {
      provide: UnitOfWork,
      useClass: TypeOrmUnitOfWork
    },
    {
      provide: LoggerProvider,
      useClass: AppLoggerImpl
    },
    {
      provide: SystemMetricsProvider,
      useClass: SystemMetricsImpl
    },

    CsvExtractor,
    {
      provide: FILE_EXTRACTORS,
      useFactory: (
        csvExtractor: CsvExtractor
      ): FileExtractor[] => [
        csvExtractor
      ],
      inject: [ 
        CsvExtractor
      ]
    },
    {
      provide: FileExtractorFactory,
      useFactory: (extractors: FileExtractor[]) => new FileExtractorFactory(extractors),
      inject: [FILE_EXTRACTORS]
    }
  ],
  exports: [
    TransactionContext,
    UnitOfWork,
    LoggerProvider,
    SystemMetricsProvider,
    FileExtractorFactory
  ]
})
export class SharedModule {}