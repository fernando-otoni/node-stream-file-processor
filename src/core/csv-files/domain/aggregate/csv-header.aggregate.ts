import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { CsvHeaderValidatorFactory } from "../validators/csv-header.validator";
import { CsvHeaderEntity } from "../entities/csv-header.entity";
import { StringUtils } from "src/core/shared/utils/helpers/string.util";

interface CsvHeaderConstructorProps {
  id?: number | undefined
  name: string
  index: number
  file_id: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | undefined
}

export default class CsvHeader extends AggregateRoot {
  id: number | undefined
  name: string
  index: number
  file_id: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined

  constructor (props: CsvHeaderConstructorProps) {
    super()
    this.id = this?.id ?? undefined
    this.name = this.formatString(props.name)
    this.index = props.index
    this.file_id = props.file_id
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.deleted_at = props.deleted_at ?? undefined
  }

  private validate(fields: string[]) {
    const validator = CsvHeaderValidatorFactory.create()

    validator.validate(this.notification, this, fields)
  }

  static create(props: CsvHeaderConstructorProps) {
    const aggregate = new CsvHeader(props)

    aggregate.validate(['create'])

    return aggregate
  }

  hasError() {
    return this.notification.hasErrors()
  }

  private formatString(s: string) {
    return StringUtils.removeSpecialCharacters(s)
  }

  toEntity(): CsvHeaderEntity {
    return {
      id: this.id,
      file_id: this.file_id,
      name: this.name,
      index: this.index,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }
}