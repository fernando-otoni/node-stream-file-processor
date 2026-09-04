import { AggregateRoot } from "src/core/shared/domain/aggregate-root";
import { StringUtils } from "src/core/shared/utils/helpers/string.util";
import { XlsxWorksheetValidatorFactory } from "../validators/xlsx-worksheet.validator";
import { XlsxWorksheetEntity } from "../entities/xlsx-worksheet.entity";

interface XlsxWorksheetConstructorProps {
  id?: number | undefined
  name: string
  file_id: number
  index: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date | undefined
}

export default class XlsxWorksheet extends AggregateRoot {
  id?: number | undefined
  name: string
  index: number
  file_id: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | undefined

  constructor(props: XlsxWorksheetConstructorProps) {
    super()
    this.id = props?.id ?? undefined
    this.name = this.formatString(props.name)
    this.index = props.index
    this.file_id = props.file_id
    this.created_at = props.created_at ?? new Date()
    this.updated_at = props.updated_at ?? new Date()
    this.deleted_at = props.deleted_at ?? undefined
  }

  hasError() {
    return this.notification.hasErrors()
  }

  static create(props: XlsxWorksheetConstructorProps) {
    const aggregate = new XlsxWorksheet(props)

    aggregate.validate(['create'])

    return aggregate
  }

  private validate(fields: string[]) {
    const validator = XlsxWorksheetValidatorFactory.create()

    validator.validate(this.notification, this, fields)
  }

  private formatString(s: string) {
    return StringUtils.removeSpecialCharacters(s)
  }

  toEntity(): XlsxWorksheetEntity {
    return {
      id: this.id,
      name: this.name,
      index: this.index,
      file_id: this.file_id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    }
  }
}