import { Module } from "@nestjs/common";
import { AppConfigProvider } from "./config/app-config.interface";
import { AppConfigImpl } from "./config/app-config.provider";

@Module({
  imports: [],
  providers: [
    {
      provide: AppConfigProvider,
      useClass: AppConfigImpl
    }
  ],
  exports: [AppConfigProvider]

})

export class ModulesModule { }
