import { FileExtractor } from "../../application/file-extractor.interface";
import { Inject, NotImplementedException } from "@nestjs/common";
import { FILE_EXTRACTORS } from "./file-extractor.token";

export class FileExtractorFactory {
  constructor(
    @Inject(FILE_EXTRACTORS)
    private readonly strategies: FileExtractor[]
  ) {}

  from(mimetype: string): FileExtractor {
    const extractor = this.strategies.find(s => s.supports(mimetype))
    if(!extractor) {
      throw new NotImplementedException(`No extractor for ${mimetype} files`)
    }

    return extractor
  }
}
