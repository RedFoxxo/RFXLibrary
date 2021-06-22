import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ConfigurationModel, MessageStyleModel } from './models';

@Injectable({
  providedIn: 'root',
})
export class RfxLoggerService {
  private showDebugInfo: boolean;

  private readonly successStyle: MessageStyleModel;
  private readonly warningStyle: MessageStyleModel;
  private readonly errorStyle: MessageStyleModel;
  private readonly traceStyle: MessageStyleModel;

  constructor(
    @Optional() configuration: ConfigurationModel
  ) {
    this.showDebugInfo = !configuration?.disableDebug;

    this.successStyle = {
      style: 'color: #8BC34A; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #000000; font-weight: bold; background-color: #8BC34A; padding: 1px 5px;'
    };

    this.warningStyle = {
      style: 'color: #FFC107; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #000000; font-weight: bold; background-color: #FFC107; padding: 1px 5px;'
    };

    this.errorStyle = {
      style: 'color: #F44336; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #F44336; padding: 1px 5px;'
    };

    this.traceStyle = {
      style: 'color: #FFFFFF; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #757575; padding: 1px 5px;'
    }
  }

  public success(message: string, data?: any): void {
    const isHttpResponse: boolean = data instanceof HttpResponse;
    const messageTag: string = isHttpResponse && data?.status ? ` ${data.status} ` : 'SUCCESS';
    const messageData: any = this.parseMessage(data, isHttpResponse);
    console.log(
      `%c ${messageTag} %c ${message}`,
      this.successStyle.tagStyle,
      this.successStyle.style,
      this.showDebugInfo && data ? messageData : ''
    );
  }

  public warning(message: string, data?: any): void {
    const messageData: any = this.parseMessage(data);

    console.log(
      `%c WARNING %c ${message}`,
      this.warningStyle.tagStyle,
      this.warningStyle.style,
      this.showDebugInfo && data ? messageData : ''
    );
  }

  public error(message: string, data?: any): void {
    const isHttpResponse: boolean = data instanceof HttpErrorResponse;
    const messageTag: string = isHttpResponse && data?.status ? ` ${data.status} ` : 'ERROR';
    const messageData: any = this.parseMessage(data, isHttpResponse);

    console.log(
      `%c  ${messageTag}  %c ${message}`,
      this.errorStyle.tagStyle,
      this.errorStyle.style,
      this.showDebugInfo && data ? messageData : ''
    );
  }

  public trace(message: string, data?: any): void {
    if (this.showDebugInfo) {
      const messageData: any = this.parseMessage(data);

      console.log(
        `%c  TRACE  %c ${message}`,
        this.traceStyle.tagStyle,
        this.traceStyle.style,
        data ? messageData : ''
      )

      // console.log('%c trace ', 'background-color: #c6d1d3; color: #000', `[${this.getDate()}]: ${JSON.stringify(message)}`, data);
    }
  }

  private getCurrentDate() {
    const date = new Date();
    return date.toLocaleTimeString();
  }

  private parseMessage(data: any, isHttpResponse: boolean = false): any {
    if (isHttpResponse && (data?.body || data?.error)) {
      return Array(this.isPrimitive(data.body ?? data.error) ? (data.body ?? data.error) : Array(data.body ?? data.error));
    }
    return Array(this.isPrimitive(data) ? Array(data) : data);
  }

  private isPrimitive(value: any): boolean {
    return value !== Object(value);
  }
}
