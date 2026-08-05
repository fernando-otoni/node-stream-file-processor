import { Injectable } from "@nestjs/common";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileRepository } from "src/core/files/domain/repositories/file.repository";
import { UseCase } from "src/core/shared/application/use-case.interface";

@Injectable()
export class GetNextPendingFile implements UseCase<void, File | undefined> {
  constructor(private readonly fileRepository: FileRepository) {}
  async call() {
    const file = await this.fileRepository.getNextPendingFile()
    if(!file) {
      return
    }

    const fileAggregate = new File(file)

    return fileAggregate
  }
}