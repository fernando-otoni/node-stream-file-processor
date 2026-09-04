import { Injectable } from "@nestjs/common";
import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";
import { XlsxRowEntity } from "../entities/xlsx-row.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";
import { XlsxRowRepository } from "src/core/xlsx-files/domain/repositories/xlsx-row.repository";

@Injectable()
export class XlsxRowRepositoryImpl
  extends TypeOrmRepository<XlsxRowEntity>
  implements XlsxRowRepository {

  constructor(
    @InjectRepository(XlsxRowEntity)
    repository: Repository<XlsxRowEntity>,
    transactionContext: TransactionContext
  ) {
    super(XlsxRowEntity, repository, transactionContext)
  }

  async save(file: XlsxRowEntity): Promise<XlsxRowEntity> {
    return await this.getRepository().save(file)
  }

  async bulkCreate(entities: XlsxRowEntity[]): Promise<void> {
    await this.getRepository().insert(entities);
  }
}