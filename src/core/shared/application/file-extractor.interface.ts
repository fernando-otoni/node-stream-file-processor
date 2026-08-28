import { Readable } from "stream";

export abstract class FileExtractor {
  supports: (mimetype: string) => boolean
  extract: (file: Readable) => AsyncIterable<any>
}