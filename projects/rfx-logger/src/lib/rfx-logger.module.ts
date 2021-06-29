import { NgModule, ModuleWithProviders } from '@angular/core';
import { ConfigurationModel } from './models';
import { RfxLoggerService } from './rfx-logger.service';

@NgModule({
  imports: [],
  exports: []
})
export class RfxLoggerModule {
  public static config(configuration: ConfigurationModel): ModuleWithProviders<RfxLoggerModule> {
    return {
      ngModule: RfxLoggerModule,
      providers: [
        RfxLoggerService,
        {
          provide: ConfigurationModel,
          useValue: configuration
        }
      ]
    }
  }
}
