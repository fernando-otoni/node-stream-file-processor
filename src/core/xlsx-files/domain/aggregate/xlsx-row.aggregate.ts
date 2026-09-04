import { AggregateRoot } from "src/core/shared/domain/aggregate-root"
import { XlsxRowValidatorFactory } from "../validators/xlsx-row.validator"
import { StringUtils } from "src/core/shared/utils/helpers/string.util"
import { XlsxRowEntity } from "../entities/xlsx-row.entity"

interface XlsxRowConstructorProps {
  id?: number | undefined
  file_id: number
  worksheet_index: number
  data: (string | number)[]
  row: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | undefined
}

export default class XlsxRow extends AggregateRoot {
  id: number | undefined
  file_id: number
  worksheet_index: number
  data: (string | number)[]
  row: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined

  constructor(props: XlsxRowConstructorProps) {
    super()
    this.id = props?.id ?? undefined
    this.file_id = props.file_id
    this.worksheet_index = props.worksheet_index
    this.data = props.data.map(v => this.formatString(v))
    this.row = props.row
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.deleted_at = props.deleted_at ?? undefined
  }

  hasError() {
    return this.notification.hasErrors()
  }

  static create(props: XlsxRowConstructorProps) {
    const aggregate = new XlsxRow(props)

    aggregate.validate(['create'])

    return aggregate
  }

  private validate(fields: string[]) {
    const validator = XlsxRowValidatorFactory.create()

    validator.validate(this.notification, this, fields)
  }

  private formatString(value: string | number) {
    if(typeof value === 'number') {
      return value
    }

    return StringUtils.removeSpecialCharacters(value, false).slice(0, 255)
  }

  toEntity(): XlsxRowEntity {
    return {
      id: this.id,
      file_id: this.file_id,
      worksheet_index: this.worksheet_index,
      data: this.data,
      row: this.row,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }
}

