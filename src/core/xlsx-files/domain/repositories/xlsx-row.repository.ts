import { XlsxRowEntity } from "../entities/xlsx-row.entity";

export abstract class XlsxRowRepository {
  bulkCreate: (array: XlsxRowEntity[]) => Promise<void>
}