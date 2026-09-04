import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";
import { XlsxHeaderEntity } from "../entities/xlsx-header.entity";
import { XlsxHeaderRepository } from "src/core/xlsx-files/domain/repositories/xlsx-header.repository";

export class XlsxHeadersRepositoryImpl
  extends TypeOrmRepository<XlsxHeaderEntity>
  implements XlsxHeaderRepository {

  constructor(
    @InjectRepository(XlsxHeaderEntity)
    repository: Repository<XlsxHeaderEntity>,
    transactionContext: TransactionContext
  ) {
    super(XlsxHeaderEntity, repository, transactionContext)
  }

  async save(file: XlsxHeaderEntity): Promise<XlsxHeaderEntity> {
    return await this.getRepository().save(file)
  }

  async bulkCreate(entities: XlsxHeaderEntity[]): Promise<void> {
    await this.getRepository().insert(entities);
  }
}