import { CsvHeaderRepository } from "src/core/csv-files/domain/repositories/csv-header.repository";
import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";
import { CsvHeaderEntity } from "../entities/csv-header.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";

export class CsvHeadersRepositoryImpl
  extends TypeOrmRepository<CsvHeaderEntity>
  implements CsvHeaderRepository {

  constructor(
    @InjectRepository(CsvHeaderEntity)
    repository: Repository<CsvHeaderEntity>,
    transactionContext: TransactionContext
  ) {
    super(CsvHeaderEntity, repository, transactionContext)
  }

  async save(file: CsvHeaderEntity): Promise<CsvHeaderEntity> {
    return await this.getRepository().save(file)
  }

  async bulkCreate(entities: CsvHeaderEntity[]): Promise<void> {
    await this.getRepository().insert(entities);
  }
}