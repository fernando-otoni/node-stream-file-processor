import { AggregateRoot } from "src/core/shared/domain/aggregate-root"
import { CsvRowValidatorFactory } from "../validators/csv-row.validator"
import { StringUtils } from "src/core/shared/utils/helpers/string.util"
import { CsvRowEntity } from "../entities/csv-row.entity"

interface CsvRowConstructorProps {
  id?: number | undefined
  file_id: number
  data: string[]
  row: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | undefined
}

export default class CsvRow extends AggregateRoot {
  id: number | undefined
  file_id: number
  data: string[]
  row: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined

  constructor(props: CsvRowConstructorProps) {
    super()
    this.id = props?.id ?? undefined
    this.file_id = props.file_id
    this.data = props.data.map(s => this.formatString(s))
    this.row = props.row
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.deleted_at = props.deleted_at ?? undefined
  }

  hasError() {
    return this.notification.hasErrors()
  }

  static create(props: CsvRowConstructorProps) {
    const aggregate = new CsvRow(props)

    aggregate.validate(['create'])

    return aggregate
  }

  private validate(fields: string[]) {
    const validator = CsvRowValidatorFactory.create()

    validator.validate(this.notification, this, fields)
  }

  private formatString(s: string) {
    return StringUtils.removeSpecialCharacters(s)
  }

  toEntity(): CsvRowEntity {
    return {
      id: this.id,
      file_id: this.file_id,
      data: this.data,
      row: this.row,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }
}

