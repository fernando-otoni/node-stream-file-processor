import { CsvHeaderEntity } from "../entities/csv-header.entity";

export abstract class CsvHeaderRepository {
  save: (header: CsvHeaderEntity) => Promise<CsvHeaderEntity>
  bulkCreate: (array: CsvHeaderEntity[]) => Promise<void>
}