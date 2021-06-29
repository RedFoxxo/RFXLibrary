import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ConfigurationModel, LogTypeEnum, LogStyleModel } from './models';
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
    this.checkProductionVar(configuration);
  }

  public success(message: string, data?: any): void {
    if (!this.isLoggerDisabled() && this.isLogTypeEnabled(LogTypeEnum.SUCCESS)) {
      const logStyle: LogStyleModel = this.getLogStyle(LogTypeEnum.SUCCESS);
      const httpCode: string | null = this.getHttpCode(data);
      const logTag: string = httpCode ? `  ${httpCode}  ` : 'SUCCESS';
      const formattedMessage: string[] = this.getFormattedLog(logTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  public warning(message: string, data?: any): void {
    if (!this.isLoggerDisabled() && this.isLogTypeEnabled(LogTypeEnum.WARNING)) {
      const logStyle: LogStyleModel = this.getLogStyle(LogTypeEnum.WARNING);
      const httpCode: string | null = this.getHttpCode(data);
      const logTag: string = httpCode ? `  ${httpCode}  ` : 'WARNING';
      const formattedMessage: string[] = this.getFormattedLog(logTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  public error(message: string, data?: any): void {
    if (!this.isLoggerDisabled() && this.isLogTypeEnabled(LogTypeEnum.ERROR)) {
      const logStyle: LogStyleModel = this.getLogStyle(LogTypeEnum.ERROR);
      const httpCode: string | null = this.getHttpCode(data);
      const logTag: string = httpCode ? `  ${httpCode}  ` : ' ERROR ';
      const formattedMessage: string[] = this.getFormattedLog(logTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  public trace(message: string, data?: any): void {
    if (!this.isLoggerDisabled() && this.isLogTypeEnabled(LogTypeEnum.TRACE)) {
      const logStyle: LogStyleModel = this.getLogStyle(LogTypeEnum.TRACE);
      const httpCode: string | null = this.getHttpCode(data);
      const logTag: string = httpCode ? `  ${httpCode}  ` : ' TRACE ';
      const formattedMessage: string[] = this.getFormattedLog(logTag, message, logStyle);
      this.consoleMessage(formattedMessage, data);
    }
  }

  private getCurrentDate() {
    return new Date().toLocaleTimeString(undefined, { hour12: false });
  }

  private isHttpStatusValid(status: number | undefined): boolean {
    return !!status && status.toString().length === 3;
  }

  private getLogStyle(logType: LogTypeEnum): LogStyleModel {
    const colorsConfig: LogStyleModel[] = this.getConfigValue('colorsConfig');
    return colorsConfig.find(x => x.logType === logType) as LogStyleModel;
  }

  private getHttpCode(data: any): string | null {
    const isHttpResponse: boolean = data instanceof HttpErrorResponse || data instanceof HttpResponse;
    return isHttpResponse && this.isHttpStatusValid(data?.status) ? data.status : null;
  }

  private getFormattedLog(messageTag: string, message: string, logStyle: LogStyleModel): string[] {
    return [
      `%c ${messageTag} %c ${this.isTimeDisabled() ? '' : `${this.getCurrentDate()} - `}%c${message}`,
      logStyle.tagStyle,
      logStyle.timeStyle,
      logStyle.textStyle
    ];
  }

  private consoleMessage(formattedMessage: string[], data: any): void {
    if (this.isVerboseDisabled() || data === undefined) {
      console.log(...formattedMessage);
    } else {
      console.groupCollapsed(...formattedMessage);
      console.log(data);
      console.groupEnd();
    }
  }

  private checkProductionVar(configuration: ConfigurationModel): void {
    if (configuration?.production === undefined) {
      this.warning('Production variable is not set!\nPlease visit https://github.com/RedFoxxo/RFXLibrary/tree/master/projects/rfx-logger#import-module-and-interceptor for more info.');
    }
  }

  private getConfigValue(field: string): any {
    return (this.configuration as {[key: string]: any})[field] === undefined ?
      (RfxLoggerConfig.config as {[key: string]: any})[field] :
      (this.configuration as {[key: string]: any})[field];
  }

  private isLogTypeEnabled(logType: LogTypeEnum): boolean {
    const isProduction: boolean = this.getConfigValue('production');
    const config: (LogTypeEnum | string)[] = this.getConfigValue(isProduction ? 'productionEnabledLogs' : 'developmentEnabledLogs');
    return !!config.find(x => x === logType);
  }

  private isLoggerDisabled(): boolean {
    const isProduction: boolean = this.getConfigValue('production');
    return this.getConfigValue(isProduction ? 'disableLoggerInProduction' : 'disableLoggerInDevelopment');
  }

  private isTimeDisabled(): boolean {
    const isProduction: boolean = this.getConfigValue('production');
    return this.getConfigValue(isProduction ? 'disableTimeInProduction' : 'disableTimeInDevelopment');
  }

  private isVerboseDisabled(): boolean {
    const isProduction: boolean = this.getConfigValue('production');
    return this.getConfigValue(isProduction ? 'disableVerboseInProduction' : 'disableVerboseInDevelopment');
  }
}
