import { LogTypeEnum } from "./log-type.enum";

export interface LogStyleModel {
  /**
   * Log type
   * You can use LogTypeEnum (ex. LogTypeEnum.ERROR)
   * or 'error' if you prefer string approach
   */
  logType: LogTypeEnum | string;

  /**
   * CSS style of the message
   */
  textStyle: string;

  /**
   * CSS style of the tag
   */
  tagStyle: string;

  /**
   * CSS style of the time
   */
  timeStyle: string;

  /**
   * CSS style of the http response time
   */
  responseTimeStyle: string;
}
