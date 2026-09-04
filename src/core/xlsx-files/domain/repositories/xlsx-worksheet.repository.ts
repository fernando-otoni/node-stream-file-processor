import { XlsxWorksheetEntity } from "../entities/xlsx-worksheet.entity";

export abstract class XlsxWorksheetRepository {
  save: (header: XlsxWorksheetEntity) => Promise<XlsxWorksheetEntity>
  bulkCreate: (array: XlsxWorksheetEntity[]) => Promise<void>
}