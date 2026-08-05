import { Global, Module } from "@nestjs/common";
import { TransactionContext } from "./infra/persistence/typeorm/transaction/transaction-context";
import { TypeOrmUnitOfWork } from "./infra/persistence/typeorm/transaction/typeorm-unit-of-work";
import { UnitOfWork } from "./application/unit-of-work.interface";

@Global()
@Module({
  imports: [],
  providers: [
    TransactionContext,
    {
      provide: UnitOfWork,
      useClass: TypeOrmUnitOfWork
    }
  ],
  exports: [
    TransactionContext,
    UnitOfWork
  ]
})
export class SharedModule {}