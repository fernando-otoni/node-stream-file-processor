import { AggregateRoot } from "../../domain/aggregate-root";
import { UploadedFileValidatorFactory } from "./uploaded-file.validator";

interface UploadFileConstructor {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

export class UploadedFile extends AggregateRoot {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number

  constructor(props: UploadFileConstructor) {
    super()
    this.fieldname = props.fieldname
    this.originalname = props.originalname
    this.encoding = props.encoding
    this.mimetype = props.mimetype
    this.destination = props.destination
    this.filename = props.filename
    this.path = props.path
    this.size = props.size
  }

  static fromMulter(input: Express.Multer.File): UploadedFile {
    const file = new UploadedFile({
      destination: input.destination,
      encoding: input.encoding,
      fieldname: input.fieldname,
      filename: input.filename,
      mimetype: input.mimetype,
      originalname: input.originalname,
      path: input.path,
      size: input.size
    })

    file.validate(['create'])

    return file
  }

  validate(fields: string[]) {
    const validator = UploadedFileValidatorFactory.create()

    return validator.validate(this.notification, this, fields)
  }

  toJSON() {
    return {
      destination: this.destination,
      enconding: this.encoding,
      fieldname: this.fieldname,
      filename: this.filename,
      mimetype: this.mimetype,
      originalname: this.originalname,
      path: this.path,
      size: this.size
    }
  }
}