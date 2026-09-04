import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './core/files/files.module';
import { SharedModule } from './core/shared/shared.module';
import { ModulesModule } from './modules/modules.module';
import { ConfigModule } from '@nestjs/config';
import { CsvFilesModule } from './core/csv-files/csv-files.module';
import { XlsxFilesModule } from './core/xlsx-files/xlsx-files.module';

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
      synchronize: true,
      logger: 'debug'
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FilesModule,
    SharedModule,
    ModulesModule,
    CsvFilesModule,
    XlsxFilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
