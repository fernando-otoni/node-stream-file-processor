import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './core/files/files.module';
import { SharedModule } from './core/shared/shared.module';

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
    FilesModule,
    SharedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
