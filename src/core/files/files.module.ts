import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./infra/database/entities/files.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class FilesModule { }