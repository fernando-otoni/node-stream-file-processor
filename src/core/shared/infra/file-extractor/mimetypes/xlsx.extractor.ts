import { Injectable } from "@nestjs/common";
import { FileExtractor } from "src/core/shared/application/file-extractor.interface";
import { Readable } from "stream";
import ExcelJs from 'exceljs'

interface Worksheet {
  name: string
  id: number
  worksheet_readable: ExcelJs.stream.xlsx.WorksheetReader
}

@Injectable()
export class XlsxExtractor implements FileExtractor {
  async *extract(readable: Readable): AsyncIterable<Worksheet> {
    const workbookReader = new ExcelJs.stream.xlsx.WorkbookReader(readable, {
      worksheets: 'emit',
      sharedStrings: 'cache',
      hyperlinks: 'ignore',
      styles: 'cache',
      entries: 'ignore',
    })

    for await (const worksheet of workbookReader) {
      const w = worksheet as any

      yield {
        name: w.name,
        id: w.id,
        worksheet_readable: worksheet
      }
    }
  }
  
  supports(mimetype: string): boolean {
    return mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
}