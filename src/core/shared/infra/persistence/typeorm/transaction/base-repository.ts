import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { TransactionContext } from "./transaction-context";

export abstract class TypeOrmRepository<TEntity extends ObjectLiteral> {
  constructor(
    protected readonly entity: EntityTarget<TEntity>,
    protected readonly ormRepository: Repository<TEntity>,
    protected readonly transactionContext: TransactionContext
  ) {}

  protected getRepository(): Repository<TEntity> {
    const manager = this.transactionContext.getManager()

    if(manager) {
      return manager.getRepository(this.entity)
    }

    return this.ormRepository
  }
}