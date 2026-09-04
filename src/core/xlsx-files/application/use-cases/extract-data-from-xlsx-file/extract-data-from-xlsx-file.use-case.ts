import { Injectable, Logger } from "@nestjs/common";
import { UseCase } from "src/core/shared/application/use-case.interface";
import { ExtractDataFromXlsxFile } from "./extract-data-from-xlsx-file.input";
import { createReadStream } from "fs";
import XlsxWorksheet from "src/core/xlsx-files/domain/aggregate/xlsx-worksheet.aggregate";
import XlsxHeader from "src/core/xlsx-files/domain/aggregate/xlsx-header.aggregate";
import XlsxRow from "src/core/xlsx-files/domain/aggregate/xlsx-row.aggregate";
import { FileExtractorFactory } from "src/core/shared/infra/file-extractor/file-extractor.strategy";
import { EntityValidationError } from "src/core/shared/domain/errors/entity-validation.error";
import { XlsxRowData } from "src/core/xlsx-files/domain/entities/xlsx-row.entity";
import { LoggerProvider } from "src/core/shared/application/logger.interface";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { XlsxWorksheetRepository } from "src/core/xlsx-files/domain/repositories/xlsx-worksheet.repository";
import { XlsxHeaderRepository } from "src/core/xlsx-files/domain/repositories/xlsx-header.repository";
import { XlsxRowRepository } from "src/core/xlsx-files/domain/repositories/xlsx-row.repository";
import { FileJob } from "src/core/files/domain/aggregate/file-job.aggregate";

interface XlsxSharedInfo {
  file_id: number
  worksheet_index: number
  row_values: XlsxRowData
}

@Injectable()
export class ExtractDataFromXlsxFileUseCase implements UseCase<ExtractDataFromXlsxFile, void> {
  constructor(
    private readonly fileJobRepository: FileJobRepository,
    private readonly fileExtractor: FileExtractorFactory,
    private readonly logger: LoggerProvider,
    private readonly xlsxWorksheetRepository: XlsxWorksheetRepository,
    private readonly xlsxHeaderRepository: XlsxHeaderRepository,
    private readonly xlsxRowRepository: XlsxRowRepository,
  ) {}

  async call({ file, file_job }: ExtractDataFromXlsxFile): Promise<void> {
    let worksheets_length = 0
    let headers_length = 0
    let rows_length = 0

    this.logger.log({
      method: `${this.constructor.name}.call()`,
      message: 'Extracting Xlsx file initiated',
      file_id: file.id,
      file_job_id: file_job.id
    })

    try {
      const readableStream = this.generateReadableStream({
        file_path: file.path,
        mimetype: file.mimetype
      })
      
      for await (const worksheet of readableStream) { 
        try {
          const worksheetAggregate = this.createAndValidateWorksheet({
            name: worksheet.name,
            index: worksheet.id,
            file_id: file.id!
          })
    
          await this.xlsxWorksheetRepository.save(worksheetAggregate.toEntity())

          this.logger.log({
            method: `${this.constructor.name}.call()`,
            message: 'Worksheet successfully saved',
            step: 'persist_worksheet',
            file_id: file.id,
          })

          worksheets_length++
  
          let generate_headers = true
          let rowIndex = 1
          const rows: XlsxRow[] = []
          for await (const row of worksheet.worksheet_readable) {
            const row_values = this.extractRowValues(row)
  
            const xlsxSharedInfo: XlsxSharedInfo = {
              file_id: file.id!,
              worksheet_index: worksheet.id,
              row_values
            }

            if(rows.length === 100) {
              await this.persistRows(rows)
  
              rows.length = 0
            }

            if(generate_headers) {
              const headers = this.createAndValidateHeaders(xlsxSharedInfo)

              await this.persistHeaders(headers)

              generate_headers = false
              headers_length = headers.length
              continue
            }
    
            try {
              const row = this.createAndValidateRows({
                ...xlsxSharedInfo,
                row_index: rowIndex
              })

              rows.push(row)
            } catch (error) {
              this.logger.error({
                method: `${this.constructor.name}.call()`,
                file_id: file.id!,
                file_job_id: file_job.id,
                worksheet_index: worksheet.id,
                step: 'create_and_validate_rows',
                error: error?.message ?? 'Unknown error',
                row_index: rowIndex
              })
            }
  
            rowIndex++
          }
  
          if(rows.length) {
            await this.persistRows(rows)
  
            rows_length += rows.length
          }
        } catch (error) {
          console.log(error)
        }
      }
  
      file_job.toCompleted()
      
      await this.fileJobRepository.save(file_job.toEntity())
  
      Logger.log({
        method: `${this.constructor.name}.call()`,
        message: 'Extracting Xlsx file successfully ended',
        worksheets_length,
        headers_length,
        rows_length
      })
    } catch (error) {
      const errorMessage = error?.message

      this.logger.error({
        method: `${this.constructor.name}.call()`,
        file: file.id,
        error: errorMessage ?? '',
        stack: error.stack
      })

      await this.setFileJobToFailedAndPersist({
        file_job,
        error_message: errorMessage
      })
    }
  }

  private async persistRows(rows: XlsxRow[]) {
    const toEntities = rows.map(r => r.toEntity())

    await this.xlsxRowRepository.bulkCreate(toEntities)

    this.logger.log({
      method: `${this.constructor.name}`,
      message: 'Rows successfully saved',
      step: 'persist_rows',
      rows_length: rows.length
    })
  }

  private generateReadableStream(data: { file_path: string, mimetype: string }) {
    const { file_path, mimetype } = data

    const readableStream = createReadStream(file_path)

    const xlsxExtractor = this.fileExtractor.from(mimetype)

    return xlsxExtractor.extract(readableStream)
  }

  private extractRowValues(row: any): XlsxRowData {
    const dirtyValues = row.values as any[]

    const cleanValues: XlsxRowData = dirtyValues.slice(1)

    return cleanValues
  }

  private createAndValidateHeaders(data: XlsxSharedInfo) {
    const { row_values, file_id, worksheet_index } = data

    const headers: XlsxHeader[] = []

    row_values.forEach((column_name, index) => {
      const headerAggregate = XlsxHeader.create({
        position_index: index,
        name: String(column_name),
        file_id,
        worksheet_index
      })

      if(headerAggregate.hasError()) {
        throw new EntityValidationError(XlsxHeader, headerAggregate.notification.toJSON())
      }

      headers.push(headerAggregate)
    })

    return headers
  }

  private async setFileJobToFailedAndPersist(data: { file_job: FileJob, error_message: string }) {
    const { error_message, file_job } = data

    file_job.toFailed()
    if(error_message) {
      file_job.setErrors([{
        method: `${this.constructor.name}.call()`,
        message: error_message
      }])
    }

    await this.fileJobRepository.save(file_job.toEntity())
  }

  private createAndValidateWorksheet(data: {
    name: string
    index: number
    file_id: number
  }) {
    const { file_id, index, name } = data
    const worksheetAggregate = XlsxWorksheet.create({
      name,
      index,
      file_id
    })

    if(worksheetAggregate.hasError()) {
      throw new EntityValidationError(XlsxWorksheet, worksheetAggregate.notification.toJSON())
    }

    return worksheetAggregate
  }

  private async persistHeaders(headers: XlsxHeader[]) {
    const toEntities = headers.map(h => h.toEntity())

    await this.xlsxHeaderRepository.bulkCreate(toEntities)

    this.logger.log({
      method: `${this.constructor.name}.call()`,
      message: 'Headers successfully saved',
      step: 'persist_headers',
      file_id: toEntities[0].file_id,
      headers_length: headers.length
    })
  }

  private createAndValidateRows(data: {
    row_values: XlsxRowData
    file_id: number
    worksheet_index: number
    row_index: number
  }) {
    const { row_values, file_id, worksheet_index, row_index } = data

    const row = XlsxRow.create({
      file_id,
      worksheet_index,
      row: row_index,
      data: row_values
    })

    if(row.hasError()) {
      throw new EntityValidationError(XlsxRow, row.notification.toJSON())
    }

    return row
  }
}