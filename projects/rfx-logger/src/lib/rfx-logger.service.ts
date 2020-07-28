import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationModel } from './configuration.model';

@Injectable({
  providedIn: 'root'
})
export class RfxLoggerService {

  private showDebugInfo: boolean;
  private readonly successCssTag: string;
  private readonly successCss: string;
  private readonly warningCssTag: string;
  private readonly warningCss: string;
  private readonly errorCssTag: string;
  private readonly errorCss: string;

  constructor(
    @Optional() configuration?: ConfigurationModel
  ) {
    this.showDebugInfo    = !configuration?.disableDebug;
    this.successCss       = 'color: #8BC34A; font-weight: bold; padding: 1px 0;';
    this.successCssTag    = 'color: #000000; font-weight: bold; background-color: #8BC34A; padding: 1px 5px;';
    this.warningCss       = 'color: #FFC107; font-weight: bold; padding: 1px 0;';
    this.warningCssTag    = 'color: #000000; font-weight: bold; background-color: #FFC107; padding: 1px 5px;';
    this.errorCss         = 'color: #F44336; font-weight: bold; padding: 1px 0;';
    this.errorCssTag      = 'color: #FFFFFF; font-weight: bold; background-color: #F44336; padding: 1px 5px;';
  }

  public success(message: string, data?: any): void {
    console.log(`%cSUCCESS%c ${message}`, this.successCssTag, this.successCss, this.showDebugInfo && data ? Array(data) : '');
  }

  public warning(message: string, data?: any): void {
    console.log(`%cWARNING%c ${message}`, this.warningCssTag, this.warningCss, this.showDebugInfo && data ? Array(data) : '');
  }

  public error(message: string, data?: any): void {
    const error = data instanceof HttpErrorResponse && data.status !== 0 ? ' ' + data.status + ' ' : 'ERROR';
    console.log(`%c ${error} %c ${message}`, this.errorCssTag, this.errorCss, this.showDebugInfo && data ? Array(data) : '');
  }

}
