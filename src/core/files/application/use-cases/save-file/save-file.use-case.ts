import { UseCase } from 'src/core/shared/application/use-case.interface'
import { SaveFileUseCaseInput } from './save-file.input';
import { File } from 'src/core/files/domain/aggregate/file.aggregate';
import { EntityValidationError } from 'src/core/shared/domain/errors/entity-validation.error';
import { Injectable, Logger } from '@nestjs/common';
import { FileRepository } from 'src/core/files/domain/repositories/file.repository';
import { FilePersistenceMapper } from 'src/core/files/infra/database/mapper/file-persistence.mapper';

@Injectable()
export class SaveFileUseCase implements UseCase<SaveFileUseCaseInput, void> {
  constructor(
    private readonly fileRepository: FileRepository
  ) {}

  async call({ uploaded_file }: SaveFileUseCaseInput) {
    const file = File.createFromUploadedFile(uploaded_file)

    if(file.hasErrors()) {
      Logger.error({
        method: `${this.constructor.name}.call()`,
        errors: JSON.stringify(file.notification.toJSON())
      })
      throw new EntityValidationError(File, file.notification.toJSON())
    }

    const toPersistence = FilePersistenceMapper.toEntity(file)

    const filePersisted = await this.fileRepository.save(toPersistence)

    Logger.log({
      method: `${this.constructor.name}.call()`,
      message: `File successfully saved`,
      file: JSON.stringify(filePersisted)
    })
  }
}