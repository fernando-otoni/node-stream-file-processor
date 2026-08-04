import { ValidationFieldError } from "../interfaces/validation-field-error.interface"

interface AddErrorInput {
  field: string
  error: string
}

export class Notification {
  errors = new Map<string, string[] | string>()

  addError({ field, error }: AddErrorInput) {
    if(field) {
      const errors = (this.errors.get(field) ?? []) as string[]

      errors.indexOf(error) === -1 && errors.push(error)
      this.errors.set(field, errors)
    } else {
      this.errors.set(error, error)
    }
  }

  setError(error: string | string[], field?: string) {
    if(field) {
      this.errors.set(field, Array.isArray(error) ? error : [error])
    } else {
      if(Array.isArray(error)) {
        error.forEach(value => {
          this.errors.set(value, value)
        })
        return
      }
      this.errors.set(error, error)
    }
  }

  copyErrors(notification: Notification) {
    notification.errors.forEach((value, field) => {
      this.setError(value, field)
    })
  }

  hasErrors(): boolean {
    return this.errors.size > 0
  }

  toJSON() {
    const errors: ValidationFieldError[] = []

    this.errors.forEach((value, key) => {
      errors.push({
        field: key,
        messages: value === 'string' ? [value] : value as string[]
      })
    })

    return errors
  }
}