import { Injectable } from "@nestjs/common";
import { CsvRowRepository } from "src/core/csv-files/domain/repositories/csv-row.repository";
import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";
import { CsvRowEntity } from "../entities/csv-row.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";

@Injectable()
export class CsvRowRepositoryImpl
  extends TypeOrmRepository<CsvRowEntity>
  implements CsvRowRepository {

  constructor(
    @InjectRepository(CsvRowEntity)
    repository: Repository<CsvRowEntity>,
    transactionContext: TransactionContext
  ) {
    super(CsvRowEntity, repository, transactionContext)
  }

  async save(file: CsvRowEntity): Promise<CsvRowEntity> {
    return await this.getRepository().save(file)
  }

  async bulkCreate(entities: CsvRowEntity[]): Promise<void> {
    await this.getRepository().insert(entities);
  }
}