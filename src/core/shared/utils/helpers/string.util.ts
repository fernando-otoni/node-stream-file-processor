export class StringUtils {
  static removeSpecialCharacters(value: string): string {
    return value?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(' ', '_');
  }
}