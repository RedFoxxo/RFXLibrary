import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ConfigurationModel, LogTypeEnum, LogStyleModel } from './models';
import { RfxLoggerConfig } from './rfx-logger.config';
import { LogResponseModel } from './models/log-response.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Rfx logger service for formatting
 * and printing console messages.
 */
export class RfxLoggerService {

  /**
   * Logger user configuration
   */
  private configuration: ConfigurationModel;

  /**
   * Set optional user configuration
   * @param configuration user configuration
   */
  constructor(
    @Optional() configuration: ConfigurationModel
  ) {
    this.configuration = configuration;
  }

  /**
   * Print a SUCCESS console message.
   * @param message short symbolic message to print
   * @param data data you want to see when message is expanded
   */
  public success(message: string, data?: any | HttpResponse<any> | HttpErrorResponse | LogResponseModel) {
    if (this.isLogTypeEnabled(LogTypeEnum.SUCCESS)) {
      const formattedMessage: string[] = this.getFormattedLog('SUCCESS', LogTypeEnum.SUCCESS, message, data);
      this.printConsoleMessage(formattedMessage, data);
    }
  }

  /**
   * Print a WARNING console message.
   * @param message short symbolic message to print
   * @param data data you want to see when message is expanded
   */
  public warning(message: string, data?: any | HttpResponse<any> | HttpErrorResponse | LogResponseModel): void {
    if (this.isLogTypeEnabled(LogTypeEnum.WARNING)) {
      const formattedMessage: string[] = this.getFormattedLog('WARNING', LogTypeEnum.WARNING, message, data);
      this.printConsoleMessage(formattedMessage, data);
    }
  }

  /**
   * Print a ERROR console message.
   * @param message short symbolic message to print
   * @param data data you want to see when message is expanded
   */
  public error(message: string, data?: any | HttpResponse<any> | HttpErrorResponse | LogResponseModel): void {
    if (this.isLogTypeEnabled(LogTypeEnum.ERROR)) {
      const formattedMessage: string[] = this.getFormattedLog(' ERROR ', LogTypeEnum.ERROR, message, data);
      this.printConsoleMessage(formattedMessage, data);
    }
  }

  /**
   * Print a TRACE console message.
   * @param message short symbolic message to print
   * @param data data you want to see when message is expanded
   */
  public trace(message: string, data?: any | HttpResponse<any> | HttpErrorResponse | LogResponseModel): void {
    if (this.isLogTypeEnabled(LogTypeEnum.TRACE)) {
      const formattedMessage: string[] = this.getFormattedLog(' TRACE ', LogTypeEnum.TRACE, message, data);
      this.printConsoleMessage(formattedMessage, data);
    }
  }

  /**
   * Get current date
   * @returns {string} current date in locale with 24h format
   */
  private getCurrentDate(): string {
    return new Date().toLocaleTimeString(undefined, { hour12: false });
  }

  /**
   * Get log css style
   * @param logType log type
   * @returns {LogStyleModel} log style
   */
  private getLogStyle(logType: LogTypeEnum): LogStyleModel {
    const colorsConfig: LogStyleModel[] = this.getConfigValue('colorsConfig');
    return colorsConfig.find(x => x.logType === logType) as LogStyleModel;
  }

  /**
   * Get http code from data
   * Data should be a valid HttpResponse, HttpErrorResponse or LogResponseModel object
   * otherwise return null
   * @param data HttpResponse, HttpResponseError, LogResponseModel or any other data
   * @returns {string | null} http code or null if code is invalid
   */
  private getHttpCode(data: any | HttpResponse<any> | HttpErrorResponse | LogResponseModel): string | null {
    const isHttpResponse: boolean = data instanceof HttpErrorResponse || data instanceof HttpResponse;

    if (!isHttpResponse && this.isLogResponseModel(data)) {
      return this.isHttpStatusValid(data.response?.status) ? data.response.status : null;
    }

    return isHttpResponse && this.isHttpStatusValid(data?.status) ? data.status : null;
  }

  private getHttpTime(data: any | HttpResponse<any> | HttpErrorResponse | LogResponseModel): number | null {
    return this.isLogResponseModel(data) && !this.getConfigValue('disableHttpCallDuration') ? data.timeMs : null;
  }

  /**
   * Get formatted ready-to-use console log
   * @param fallbackTag fallback tag content when no http status is available
   * @param messageType message type
   * @param message short symbolic message to print
   * @param data data for http status check
   * @returns {string[]} ready to use console log
   */
  private getFormattedLog(
    fallbackTag: string,
    messageType: LogTypeEnum,
    message: string,
    data?: any | HttpResponse<any> | HttpErrorResponse | LogResponseModel
  ): string[] {
    const logStyle: LogStyleModel = this.getLogStyle(messageType);
    const httpCode: string | null = this.getHttpCode(data);
    const httpTime: number | null = this.getHttpTime(data);
    const logTag: string = httpCode ? `  ${httpCode}  ` : fallbackTag;
    const isTimeDisabled: boolean = this.getConfigValue('disableTime');

    return [
      `%c ${logTag} %c ${isTimeDisabled ? '' : `${this.getCurrentDate()} - `}%c${message} %c${httpTime !== null ? `[${httpTime}ms]` : ''}`,
      logStyle.tagStyle,
      logStyle.timeStyle,
      logStyle.textStyle,
      logStyle.responseTimeStyle
    ];
  }

  /**
   * Get configuration value.
   * If user didn't configure field parameter just fallback
   * to default configuration.
   * @param field configuration field
   * @returns {any} configuration field value
   */
   private getConfigValue(field: string): any {
    if (this.configuration && (this.configuration as {[key: string]: any})[field]) {
      return (this.configuration as {[key: string]: any})[field];
    }
    return (RfxLoggerConfig.config as {[key: string]: any})[field];
  }

  /**
   * Check if a log type should be printed in console.
   * Check if log type is present in enabledLogTypes and if logger is enabled.
   * @param logType log type
   * @returns {boolean} is enabled or not
   */
  private isLogTypeEnabled(logType: LogTypeEnum): boolean {
    const config: (LogTypeEnum | string)[] = this.getConfigValue('enabledLogTypes');
    return !!config.find(x => x === logType) && !this.getConfigValue('disableLogger');
  }


  /**
   * Check if status code is valid.
   * Status is valid when it has 3 chars
   * @param status status code
   * @returns {boolean} is status valid
   */
  private isHttpStatusValid(status: number | undefined): boolean {
    return !!status && status.toString().length === 3;
  }

  /**
   * Check if data have LogResponseModel properties
   * @param data any object
   * @returns true if object have LogResponseModel properties
   */
  private isLogResponseModel(data?: any): boolean {
    return 'timeMs' in data && 'response' in data;
  }

  /**
   * Print formatted console log
   * Print a group with "console.group" when there's data and disableVerbose
   * is set to false otherwise print one line message with "console.log"
   * @param formattedMessage formatted console log message
   * @param data any type of data to insert inside the console group
   */
  private printConsoleMessage(formattedMessage: string[], data: any): void {
    if (this.getConfigValue('disableVerbose') || data === undefined) {
      console.log(...formattedMessage);
    } else {
      console.groupCollapsed(...formattedMessage);
      console.log(data);
      console.groupEnd();
    }
  }
}
