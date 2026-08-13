import { Injectable, Logger as NestLogger } from "@nestjs/common";
import { LoggerProvider } from "../../application/logger.interface";
import { AppConfigProvider } from "src/modules/config/app-config.interface";

type NestLoggerType = 'log' | 'debug' | 'error' | 'warn' 

@Injectable()
export class AppLoggerImpl implements LoggerProvider {
  constructor(
    private readonly appConfig: AppConfigProvider
  ) {}

  log(context: Record<string, unknown>): void {
    this.callNestLogger('log', context)
  }

  debug(context: Record<string, unknown>): void {
    this.callNestLogger('debug', context)
  }

  warn(context: Record<string, unknown>): void {
    this.callNestLogger('warn', context)
  }

  error(context: Record<string, unknown>): void {
    this.callNestLogger('error', context)
  }

  private callNestLogger(type: NestLoggerType, context: Record<string, unknown>) {
    const logLevel = this.appConfig.logLevel

    if(logLevel.includes(type)) {
      NestLogger[type](context)
    }
  }
}