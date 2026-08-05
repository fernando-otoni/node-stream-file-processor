import { Injectable } from "@nestjs/common";
import { UnitOfWork } from "src/core/shared/application/unit-of-work.interface";
import { DataSource } from "typeorm";
import { TransactionContext } from "./transaction-context";

@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
    private readonly transactionContext: TransactionContext
  ) {}

  async runInTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async manager => {
      return this.transactionContext.run(manager, callback)
    })
  }
}