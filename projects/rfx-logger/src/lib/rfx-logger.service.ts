import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ConfigurationModel, LogTypeEnum, MessageStyleModel } from './models';
import { RfxLoggerConfig } from './rfx-logger.config';

@Injectable({
  providedIn: 'root',
})
export class RfxLoggerService {
  private configuration: ConfigurationModel;

  constructor(
    @Optional() configuration: ConfigurationModel
  ) {
    this.configuration = configuration;
  }

  public success(message: string, data?: any): void {
    if (!this.configuration?.disableLogger) {
      const logStyle: MessageStyleModel = this.getMessageStyle(LogTypeEnum.SUCCESS);
      const httpCode: string | null = this.getHttpCode(data);
      const messageTag: string = httpCode ? `  ${httpCode}  ` : 'SUCCESS';
      const formattedMessage: string[] = this.getFormattedMessage(messageTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  public warning(message: string, data?: any): void {
    if (!this.configuration?.disableLogger) {
      const logStyle: MessageStyleModel = this.getMessageStyle(LogTypeEnum.WARNING);
      const httpCode: string | null = this.getHttpCode(data);
      const messageTag: string = httpCode ? `  ${httpCode}  ` : 'WARNING';
      const formattedMessage: string[] = this.getFormattedMessage(messageTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  public error(message: string, data?: any): void {
    if (!this.configuration?.disableLogger) {
      const logStyle: MessageStyleModel = this.getMessageStyle(LogTypeEnum.ERROR);
      const httpCode: string | null = this.getHttpCode(data);
      const messageTag: string = httpCode ? `  ${httpCode}  ` : ' ERROR ';
      const formattedMessage: string[] = this.getFormattedMessage(messageTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  public trace(message: string, data?: any): void {
    if (!this.configuration?.disableLogger) {
      const logStyle: MessageStyleModel = this.getMessageStyle(LogTypeEnum.TRACE);
      const httpCode: string | null = this.getHttpCode(data);
      const messageTag: string = httpCode ? `  ${httpCode}  ` : ' TRACE ';
      const formattedMessage: string[] = this.getFormattedMessage(messageTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  private getCurrentDate() {
    return new Date().toLocaleTimeString(undefined, { hour12: false });
  }

  private isHttpStatusValid(status: number | undefined): boolean {
    return !!status && status.toString().length === 3;
  }

  private getMessageStyle(logType: LogTypeEnum): MessageStyleModel {
    return this.configuration?.colorsConfig?.find(x => x.logType === logType) ??
      (RfxLoggerConfig.config.colorsConfig?.find(x => x.logType === logType) as MessageStyleModel);
  }

  private getHttpCode(data: any): string | null {
    const isHttpResponse: boolean = data instanceof HttpErrorResponse || data instanceof HttpResponse;
    return isHttpResponse && this.isHttpStatusValid(data?.status) ? data.status : null;
  }

  private getFormattedMessage(messageTag: string, message: string, messageStyle: MessageStyleModel): string[] {
    return [
      `%c ${messageTag} %c ${this.configuration?.disableTime ? '' : `${this.getCurrentDate()} - `}%c${message}`,
      messageStyle.tagStyle,
      messageStyle.timeStyle,
      messageStyle.textStyle
    ];
  }

  private consoleMessage(formattedMessage: string[], data: any): void {
    if (this.configuration?.disableVerbose || data === undefined) {
      console.log(...formattedMessage);
    } else {
      console.groupCollapsed(...formattedMessage);
      console.log(data);
      console.groupEnd();
    }
  }
}
