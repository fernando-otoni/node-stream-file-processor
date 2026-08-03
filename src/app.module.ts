import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './core/files/files.module';

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
    FilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
