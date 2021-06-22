import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
      style: 'color: #64DD17; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #000000; font-weight: bold; background-color: #64DD17; padding: 1px 5px;',
      dateStyle: 'color: #9E9E9E; padding: 1px 0;'
    };

    this.warningStyle = {
      style: 'color: #FFC400; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #000000; font-weight: bold; background-color: #FFC400; padding: 1px 5px;',
      dateStyle: 'color: #9E9E9E; padding: 1px 0;'
    };

    this.errorStyle = {
      style: 'color: #F44336; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #D32F2F; padding: 1px 5px;',
      dateStyle: 'color: #9E9E9E; padding: 1px 0;'
    };

    this.traceStyle = {
      style: 'color: #FFFFFF; font-weight: bold; padding: 1px 0;',
      tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #757575; padding: 1px 5px;',
      dateStyle: 'color: #9E9E9E; padding: 1px 0;'
    }
  }

  public success(message: string, data?: any): void {
    const isHttpResponse: boolean = data instanceof HttpErrorResponse;
    const isHttpStatusValid: boolean = isHttpResponse && this.isHttpStatusValid(data?.status);
    const messageTag: string = isHttpStatusValid ? `  ${data.status}  ` : 'SUCCESS';
    const formattedMessage: string[] = [
      `%c ${messageTag} %c ${this.getCurrentDate()} - %c${message}`,
      this.successStyle.tagStyle,
      this.successStyle.dateStyle,
      this.successStyle.style
    ];

    if (this.showDebugInfo && data !== undefined) {
      console.groupCollapsed(...formattedMessage);
      console.log(data);
      console.groupEnd();
    } else {
      console.log(...formattedMessage);
    }
  }

  public warning(message: string, data?: any): void {
    const formattedMessage: string[] = [
      `%c WARNING %c ${this.getCurrentDate()} - %c${message}`,
      this.warningStyle.tagStyle,
      this.warningStyle.dateStyle,
      this.warningStyle.style
    ];

    if (this.showDebugInfo && data !== undefined) {
      console.groupCollapsed(...formattedMessage);
      console.log(data);
      console.groupEnd();
    } else {
      console.log(...formattedMessage);
    }
  }

  public error(message: string, data?: any): void {
    const isHttpResponse: boolean = data instanceof HttpErrorResponse;
    const isHttpStatusValid: boolean = isHttpResponse && this.isHttpStatusValid(data?.status);
    const messageTag: string = isHttpStatusValid ? `  ${data.status}  ` : ' ERROR ';
    const formattedMessage: string[] = [
      `%c ${messageTag} %c ${this.getCurrentDate()} - %c${message}`,
      this.errorStyle.tagStyle,
      this.errorStyle.dateStyle,
      this.errorStyle.style
    ];

    if (this.showDebugInfo && data !== undefined) {
      console.groupCollapsed(...formattedMessage);
      console.log(data);
      console.groupEnd();
    } else {
      console.log(...formattedMessage);
    }
  }

  public trace(message: string, data?: any): void {
    if (this.showDebugInfo) {
      const formattedMessage: string[] = [
        `%c  TRACE  %c ${this.getCurrentDate()} - %c${message}`,
        this.traceStyle.tagStyle,
        this.traceStyle.dateStyle,
        this.traceStyle.style
      ];

      if (data !== undefined) {
        console.groupCollapsed(...formattedMessage);
        console.log(data);
        console.groupEnd();
      } else {
        console.log(...formattedMessage);
      }
    }
  }

  private getCurrentDate() {
    return new Date().toLocaleTimeString(undefined, { hour12: false });
  }

  private isHttpStatusValid(status: number | undefined): boolean {
    return !!status && status.toString().length === 3;
  }
}
