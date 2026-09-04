import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { StringUtils } from "src/core/shared/utils/helpers/string.util";
import { XlsxHeaderValidatorFactory } from "../validators/xlsx-header.validator";
import { XlsxHeaderEntity } from "../entities/xlsx-header.entity";

interface XlsxHeaderConstructorProps {
  id?: number | undefined
  name: string
  position_index: number
  worksheet_index: number
  file_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | undefined
}

export default class XlsxHeader extends AggregateRoot {
  id?: number | undefined
  name: string
  position_index: number
  worksheet_index: number
  file_id: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined

  constructor (props: XlsxHeaderConstructorProps) {
    super()
    this.id = this?.id ?? undefined
    this.name = this.formatString(props.name)
    this.position_index = props.position_index
    this.worksheet_index = props.worksheet_index
    this.file_id = props.file_id
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.deleted_at = props.deleted_at ?? undefined
  }

  private validate(fields: string[]) {
    const validator = XlsxHeaderValidatorFactory.create()

    validator.validate(this.notification, this, fields)
  }

  static create(props: XlsxHeaderConstructorProps) {
    const aggregate = new XlsxHeader(props)

    aggregate.validate(['create'])

    return aggregate
  }

  hasError() {
    return this.notification.hasErrors()
  }

  private formatString(s: string) {
    return StringUtils.removeSpecialCharacters(s)
  }

  toEntity(): XlsxHeaderEntity {
    return {
      id: this.id,
      file_id: this.file_id,
      name: this.name,
      position_index: this.position_index,
      worksheet_index: this.worksheet_index,
      file: undefined,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }
}