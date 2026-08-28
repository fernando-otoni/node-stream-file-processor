import { Injectable } from "@nestjs/common";
import { parse } from "csv-parse";
import { FileExtractor } from "src/core/shared/application/file-extractor.interface";
import { Readable } from "stream";

@Injectable()
export class CsvExtractor implements FileExtractor {
  async *extract(file: Readable): AsyncIterable<Record<string, string>> {
    const parser = file.pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: [';', ',']
      })
    )

    for await (const row of parser) {
      yield row
    }
  }
  
  supports(mimetype: string): boolean {
    return mimetype === 'text/csv'
  }
}