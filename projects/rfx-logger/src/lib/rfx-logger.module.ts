import { NgModule, ModuleWithProviders } from '@angular/core';
import { IConfiguration } from './configuration.interface';

@NgModule({
  imports: [],
  exports: []
})
export class RfxLoggerModule {
  public static config(configuration: IConfiguration): ModuleWithProviders<RfxLoggerModule> {
    return {
      ngModule: RfxLoggerModule,
      providers: [
        {
          provide: IConfiguration,
          useValue: configuration
        }
      ]
    }
  }
}
