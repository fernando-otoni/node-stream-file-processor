import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './modules/upload/upload.module';
import { FileWorkerModule } from './infra/workers/file.worker.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'upload_db',
      autoLoadEntities: true,
      synchronize: true
    }),
    UploadModule,
    FileWorkerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
