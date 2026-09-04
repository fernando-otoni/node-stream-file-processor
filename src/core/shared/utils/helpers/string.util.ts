export class StringUtils {
  static removeSpecialCharacters(input: string, remove_empty_spaces = true): string {
    let result = String(input)
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    if (remove_empty_spaces) {
      result = result.replaceAll(' ', '_');
    }

    return result
  }
}