import { Injectable } from "@nestjs/common";
import { FileJobRepository } from "src/core/files/domain/repositories/file-job.repository";
import { UnitOfWork } from "src/core/shared/application/unit-of-work.interface";
import { UseCase } from "src/core/shared/application/use-case.interface";

@Injectable()
export class ReprocessFailedFileJobUseCase implements UseCase<void, void> {
  constructor(
    private readonly fileJobRepository: FileJobRepository,
    private readonly unitOfWork: UnitOfWork
  ) {}
  async call() {
    return await this.unitOfWork.runInTransaction(async () => {
      const job = await this.fileJobRepository.getNextFailedFileJob()
      console.log(job)
    })
  }
}
