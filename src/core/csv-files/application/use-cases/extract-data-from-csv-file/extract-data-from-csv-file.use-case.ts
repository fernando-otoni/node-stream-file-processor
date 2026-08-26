import { UseCase } from "src/core/shared/application/use-case.interface";
import CsvHeader from "src/core/csv-files/domain/aggregate/csv-header.aggregate";
import { LoggerProvider } from "src/core/shared/application/logger.interface";
import { Injectable } from "@nestjs/common";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { EntityValidationError } from "src/core/shared/domain/errors/entity-validation.error";
import CsvRow from "src/core/csv-files/domain/aggregate/csv-row.aggregate";
import { CsvRowRepository } from "src/core/csv-files/domain/repositories/csv-row.repository";
import { CsvHeaderRepository } from "src/core/csv-files/domain/repositories/csv-header.repository";
import { ExtractDataFromCsvFile } from "./extract-data-from-csv-file.input";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";

@Injectable()
export class ExtractDataFromCsvFileUseCase implements UseCase<ExtractDataFromCsvFile, void> {
  constructor(
    private readonly logger: LoggerProvider,
    private readonly csvRowRepository: CsvRowRepository,
    private readonly csvHeaderRepository: CsvHeaderRepository,
    private readonly fileJobRepository: FileJobRepository
  ) {}

  async call({ file, file_job }: ExtractDataFromCsvFile): Promise<void> {
    try {
      this.logger.log({
        method: `${this.constructor.name}.call()`,
        message: 'Extracting CSV file initiated',
        file_id: file.id,
        file_job_id: file_job.id
      })
  
      const { csv_headers, csv_rows } = await this.extractInfo({
        file_id: file.id!,
        file_path: file.path
      })

      this.logger.log({
        method: `${this.constructor.name}.call()`,
        message: 'Header and rows extracted',
        file_id: file.id,
        csv_headers: JSON.stringify(csv_headers.map(c => c.name)),
        csv_rows: csv_rows.length
      })
  
      await this.csvHeaderRepository.bulkCreate(csv_headers)
  
      this.logger.log({
        method: `${this.constructor.name}.call()`,
        message: 'Header saved'
      })
  
      for (let i = 0; i <= csv_rows.length; i += 100 ) {
        const batch = csv_rows.slice(i, i + 100)
        const loop = (i + 100) / 100
  
        this.logger.log({
          method: `${this.constructor.name}.call()`,
          message: `csv_row batch - ${loop}`,
          file_id: file.id,
          insert_length: batch.length
        })
  
        await this.csvRowRepository.bulkCreate(batch)
      }
  
      file_job.toCompleted()

      await this.fileJobRepository.save(file_job.toEntity())
    } catch (error) {
      const errorMessage = error?.message

      this.logger.error({
        method: `${this.constructor.name}.call()`,
        file: file.id,
        error: errorMessage ?? '',
        stack: error.stack
      })

      file_job.toFailed()
      if(errorMessage) {
        file_job.setErrors([{
          method: `${this.constructor.name}.call()`,
          message: errorMessage
        }])
      }

      await this.fileJobRepository.save(file_job.toEntity())
    }
  }

  async extractInfo(data: { file_path: string, file_id: number }): Promise<{
    csv_headers: CsvHeader[],
    csv_rows: CsvRow[]
  }> {
    const { file_path, file_id } = data
    const csvHeaders: CsvHeader[] = []
    const csvRows: CsvRow[] = []

    const parser = createReadStream(file_path).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: [';', ',']
      })
    )

    let header = true
    let index = 0
    for await (const row of parser) {
      try {
        if(header) {
          const headers = this.validateAndGenerateHeaderAggregate(row, file_id)
  
          csvHeaders.push(...headers)
          header = false
          continue
        }
    
        const data = Object.values(row).map(value => value ?? '') as string[]
  
        const rowAggregate = CsvRow.create({
          file_id,
          row: index,
          data
        })

        if(rowAggregate.hasError()) {
          throw new EntityValidationError(CsvRow, rowAggregate.notification.toJSON())
        }

        csvRows.push(rowAggregate)
      } catch (error) {
        const errorArray = error?.errors

        this.logger.error({
          method: `${this.constructor.name}.call()`,
          message: 'Error while trying to format headers and rows',
          error: errorArray?.length ? errorArray.map(e => e.messages): error?.message ?? '',
          file_id,
          row: index
        })
      } finally {
        index++
      }
    }

    return {
      csv_headers: csvHeaders,
      csv_rows: csvRows
    }
  }

  validateAndGenerateHeaderAggregate(header: Record<string, any>, file_id: number) {
    const columns = Object.entries(header).map(([name, value], index) => ({
      name,
      index,
    }));

    const csvHeadersAggregate = columns.map(c => {
      const column = CsvHeader.create({ 
        name: c.name, 
        index: c.index,
        file_id
      })

      if(column.hasError()) {
        throw new EntityValidationError(CsvHeader, column.notification.toJSON())
      }

      return column
    }) 
    
    return csvHeadersAggregate
  }
}