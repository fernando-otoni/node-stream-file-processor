import { XlsxHeaderEntity } from "../entities/xlsx-header.entity"

export abstract class XlsxHeaderRepository {
  save: (header: XlsxHeaderEntity) => Promise<XlsxHeaderEntity>
  bulkCreate: (array: XlsxHeaderEntity[]) => Promise<void>
}