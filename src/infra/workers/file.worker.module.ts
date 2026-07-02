import { Module } from '@nestjs/common';
import { QueueModule } from 'src/infra/queue/queue.module';
import { UploadModule } from 'src/modules/upload/upload.module';
import { FileWorker } from './file-workers/file.worker';
import { FileRetryWorker } from './fileretry-workers/file-retry.worker';
import { FileProcessorModule } from '../processor/file.processor.module';

@Module({
  imports: [QueueModule, UploadModule, FileProcessorModule],
  providers: [FileWorker, FileRetryWorker],
  exports: [FileWorker, FileRetryWorker],
})
export class FileWorkerModule {}