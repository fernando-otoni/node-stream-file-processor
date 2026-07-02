import { Module } from '@nestjs/common';
import { QueueModule } from 'src/infra/queue/queue.module';
import { UploadModule } from 'src/modules/upload/upload.module';
import { FileProcessor } from './file.processor';

@Module({
  imports: [QueueModule, UploadModule],
  providers: [FileProcessor],
  exports: [FileProcessor],
})
export class FileProcessorModule {}