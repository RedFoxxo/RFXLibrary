import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IConfiguration } from './configuration.interface';

@Injectable({
  providedIn: 'root',
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
    @Optional() configuration?: IConfiguration
  ) {
    this.showDebugInfo = !configuration?.disableDebug;
    this.successCss = 'color: #8BC34A; font-weight: bold; padding: 1px 0;';
    this.successCssTag = 'color: #000000; font-weight: bold; background-color: #8BC34A; padding: 1px 5px;';
    this.warningCss = 'color: #FFC107; font-weight: bold; padding: 1px 0;';
    this.warningCssTag = 'color: #000000; font-weight: bold; background-color: #FFC107; padding: 1px 5px;';
    this.errorCss = 'color: #F44336; font-weight: bold; padding: 1px 0;';
    this.errorCssTag = 'color: #FFFFFF; font-weight: bold; background-color: #F44336; padding: 1px 5px;';
  }

  public success(message: string, data?: any): void {
    const isHttpResponse: boolean = data instanceof HttpResponse;
    const messageTag: string = isHttpResponse && data?.status ? ` ${data.status} ` : 'SUCCESS';
    const messageData: any = isHttpResponse && data?.body ? data.body : data;
    console.log(
      `%c ${messageTag} %c ${message}`,
      this.successCssTag,
      this.successCss,
      this.showDebugInfo && messageData ? Array(messageData) : ''
    );
  }

  public warning(message: string, data?: any): void {
    console.log(
      `%c WARNING %c ${message}`,
      this.warningCssTag,
      this.warningCss,
      this.showDebugInfo && data ? Array(data) : ''
    );
  }

  public error(message: string, data?: any): void {
    const isHttpResponse: boolean = data instanceof HttpErrorResponse;
    const messageTag: string = isHttpResponse && data?.status ? ` ${data.status} ` : 'ERROR';
    const messageData: any = isHttpResponse && data?.error ? data.error : data;
    console.log(
      `%c ${messageTag} %c ${message}`,
      this.errorCssTag,
      this.errorCss,
      this.showDebugInfo && messageData ? Array(messageData) : ''
    );
  }
}
