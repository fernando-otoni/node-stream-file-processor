import { Controller, HttpCode, HttpStatus, Post, UploadedFile } from "@nestjs/common";
import { SaveFileUseCase } from "src/core/files/application/use-cases/save-file/save-file.use-case";
import { MulterFileMapper } from "src/core/shared/infra/upload/multer/multer-file.mapper";
import { UploadFileInterceptor } from "src/modules/http/multer/upload-file.interceptor";

@Controller('upload')
export class UploadController {
  constructor(
    private readonly saveFile: SaveFileUseCase
  ) { }

  @Post()
  @UploadFileInterceptor()
  @HttpCode(201)
  async upload(
    @UploadedFile() file: Express.Multer.File
  ) {
    const uploadedFile = MulterFileMapper.toUploadedFile(file)

    return this.saveFile.call({ 
      uploaded_file: uploadedFile
    })
  }
}