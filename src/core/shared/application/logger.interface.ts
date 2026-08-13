
export abstract class LoggerProvider {
  abstract log(context: Record<string, unknown>): void 
  abstract warn(context: Record<string, unknown>): void 
  abstract error(context: Record<string, unknown>): void 
  abstract debug(context: Record<string, unknown>): void 
}