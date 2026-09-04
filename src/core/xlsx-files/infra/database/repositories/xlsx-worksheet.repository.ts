import { TypeOrmRepository } from "src/core/shared/infra/persistence/typeorm/transaction/base-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionContext } from "src/core/shared/infra/persistence/typeorm/transaction/transaction-context";
import { XlsxWorksheetEntity } from "../entities/xlsx-worksheet.entity";
import { XlsxWorksheetRepository } from "src/core/xlsx-files/domain/repositories/xlsx-worksheet.repository";

export class XlsxWorksheetsRepositoryImpl
  extends TypeOrmRepository<XlsxWorksheetEntity>
  implements XlsxWorksheetRepository {

  constructor(
    @InjectRepository(XlsxWorksheetEntity)
    repository: Repository<XlsxWorksheetEntity>,
    transactionContext: TransactionContext
  ) {
    super(XlsxWorksheetEntity, repository, transactionContext)
  }

  async save(file: XlsxWorksheetEntity): Promise<XlsxWorksheetEntity> {
    return await this.getRepository().save(file)
  }

  async bulkCreate(entities: XlsxWorksheetEntity[]): Promise<void> {
    await this.getRepository().insert(entities);
  }
}