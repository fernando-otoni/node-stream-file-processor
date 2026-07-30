import { Controller, Post, UploadedFile } from "@nestjs/common";
import { UploadFileInterceptor } from "src/modules/http/multer/upload-file.interceptor";

@Controller('upload')
export class UploadController {
  constructor() {}

  @Post()
  @UploadFileInterceptor()
  async upload(
    @UploadedFile() file: Express.Multer.File
  ) {
    
  }
}