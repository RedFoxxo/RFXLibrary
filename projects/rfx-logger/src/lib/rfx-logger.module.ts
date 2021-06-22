import { NgModule, ModuleWithProviders } from '@angular/core';
import { ConfigurationModel } from './models';

@NgModule({
  imports: [],
  exports: []
})
export class RfxLoggerModule {
  public static config(configuration: ConfigurationModel): ModuleWithProviders<RfxLoggerModule> {
    return {
      ngModule: RfxLoggerModule,
      providers: [
        {
          provide: ConfigurationModel,
          useValue: configuration
        }
      ]
    }
  }
}
