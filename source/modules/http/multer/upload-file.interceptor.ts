import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

export function UploadFileInterceptor(fieldName = 'file') {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: './upload',
          filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`

            cb(null, filename)
          }
        })
      })
    )
  )
}