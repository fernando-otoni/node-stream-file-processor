import { Injectable } from "@nestjs/common";
import { File } from "src/core/files/domain/aggregate/file.aggregate";
import { FileRepository } from "src/core/files/domain/repositories/file.repository";
import { UseCase } from "src/core/shared/application/use-case.interface";

@Injectable()
export class GetFileToProcessUseCase implements UseCase<void, File> {
  constructor(private readonly fileRepository: FileRepository) {}
  async call() {
    const file = await this.fileRepository.getFileToProcess()

    const fileAggregate = new File(file)

    return fileAggregate
  }
}