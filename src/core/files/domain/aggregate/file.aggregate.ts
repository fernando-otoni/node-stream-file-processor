import { AggregateRoot } from "src/core/shared/domain/aggregate-root";

interface FileConstructorProps {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

export class File extends AggregateRoot {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number

  constructor(props: FileConstructorProps) {
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

  toJSON() {
    return {
      fieldname: this.fieldname,
      originalname: this.originalname,
      encoding: this.encoding,
      mimetype: this.mimetype,
      destination: this.destination,
      filename: this.filename,
      path: this.path,
      size: this.size,
    }
  }
}