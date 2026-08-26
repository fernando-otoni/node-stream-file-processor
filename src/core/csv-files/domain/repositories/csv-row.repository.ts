import { CsvRowEntity } from "../entities/csv-row.entity";

export abstract class CsvRowRepository {
  bulkCreate: (array: CsvRowEntity[]) => Promise<void>
}