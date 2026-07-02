import { Injectable, Logger } from "@nestjs/common";
import { createHash } from "crypto";
import * as fs from 'fs';
import { pipeline } from "stream/promises";

@Injectable()
export class FileProcessor {
  constructor() { }

  async call(filePath: string) {
    const hash = createHash('sha256')

    Logger.log(`Processing: ${filePath}`, 'Job')

    const readStream = fs.createReadStream(filePath)

    readStream.on('data', chunk => {
      hash.update(chunk)
    })

    readStream.on('end', () => {
      Logger.log(`Processing Ended successfully: ${filePath}`, 'Job')
    })

    const storagePath = 'processed'
    const filename = `${storagePath}/${Date.now()}.txt`
    await pipeline(
      readStream,
      fs.createWriteStream(filename)
    )

    const finalHash = hash.digest('hex')

    return {
      hash: finalHash,
      filename,
      storagePath
    }
  }
}