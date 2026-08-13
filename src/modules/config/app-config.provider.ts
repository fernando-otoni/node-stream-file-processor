import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfigProvider } from "./app-config.interface";

@Injectable()
export class AppConfigImpl implements AppConfigProvider {
  constructor(
    private readonly configService: ConfigService
  ) {}
  
  get fileJobMaxAttempts(): number {
    const maxAttempts = this.configService.get<number>('FILE_JOB_MAX_ATTEMPTS')
    if(!maxAttempts) {
      throw new Error(`FILE_JOB_MAX_ATTEMPTS in not defined`)
    }

    return +maxAttempts
  }

  get fileJobConcurrency(): number {
    const fileJobConcurrency = this.configService.get<number>('FILE_JOB_CONCURRENCY')
    if(!fileJobConcurrency) {
      throw new Error(`FILE_JOB_CONCURRENCY in not defined`)
    }

    return +fileJobConcurrency
  }

  get logLevel(): string[] {
    const logLevel = this.configService.get<string>('LOG_LEVEL')
    if(logLevel === undefined) {
      throw new Error(`LOG_LEVEL in not defined`)
    }

    return logLevel.split(",")
  }
}