import { UseCase } from "src/core/shared/application/use-case.interface";
import { Injectable, Logger } from "@nestjs/common";
import { createHash } from "crypto";
import * as fs from 'fs';
import { pipeline } from "stream/promises";
import { GenerateJobFileHashOutput } from "./generate-job-file-hash.output";
import { GenerateJobFileHashInput } from "./generate-job-file-hash.input";

@Injectable()
export class GenerateJobFileHashUseCase 
  implements UseCase<GenerateJobFileHashInput, GenerateJobFileHashOutput> {
  constructor() { }

  async call(input: GenerateJobFileHashInput) {
    const { file_path, job_id } = input
    
    Logger.log({
      method: `${this.constructor.name}.call()`,
      message: 'Starting job file processing',
      data: JSON.stringify(input),
      job_id
    })

    const hash = createHash('sha256')

    const readStream = fs.createReadStream(file_path)

    readStream.on('data', chunk => {
      hash.update(chunk)
    })

    readStream.on('end', () => {})

    const storagePath = 'files/processed'
    const filename = `${storagePath}/${Date.now()}.txt`

    await pipeline(
      readStream,
      fs.createWriteStream(filename)
    )

    const finalHash = hash.digest('hex')

    const output = {
      hash: finalHash,
      file_name: filename,
      storage_path: storagePath
    }

    Logger.log({
      method: `${this.constructor.name}.call()`,
      message: 'Job file processed successfully',
      job_id,
      output
    })

    return output
  }
}