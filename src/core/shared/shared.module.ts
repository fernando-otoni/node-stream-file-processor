import { Global, Module } from "@nestjs/common";
import { TransactionContext } from "./infra/persistence/typeorm/transaction/transaction-context";
import { TypeOrmUnitOfWork } from "./infra/persistence/typeorm/transaction/typeorm-unit-of-work";
import { UnitOfWork } from "./application/unit-of-work.interface";
import { LoggerProvider } from "./application/logger.interface";
import { AppLoggerImpl } from "./infra/logger/app-logger";
import { ModulesModule } from "src/modules/modules.module";

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
    }
  ],
  exports: [
    TransactionContext,
    UnitOfWork,
    LoggerProvider
  ]
})
export class SharedModule {}