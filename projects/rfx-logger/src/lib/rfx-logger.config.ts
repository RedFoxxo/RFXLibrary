import { ConfigurationModel, LogTypeEnum } from "./models";

/**
 * Class for config management
 */
export class RfxLoggerConfig {

  /**
   * Default package configuration
   */
  public static readonly config: ConfigurationModel = {
    disableLogger: false,
    disableVerbose: false,
    disableHttpCodes: false,
    disableHttpCallDuration: false,
    disableTime: false,
    enabledLogTypes: [
      LogTypeEnum.SUCCESS,
      LogTypeEnum.WARNING,
      LogTypeEnum.ERROR,
      LogTypeEnum.TRACE
    ],
    colorsConfig: [
      {
        logType: LogTypeEnum.SUCCESS,
        tagStyle: 'color: #000000; font-weight: bold; background-color: #8BC34A; padding: 1px 5px; margin-left: 2px;',
        textStyle: 'color: #8BC34A; font-weight: bold; padding: 1px 0;',
        timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
      },
      {
        logType: LogTypeEnum.WARNING,
        tagStyle: 'color: #000000; font-weight: bold; background-color: #FFC107; padding: 1px 5px; margin-left: 2px;',
        textStyle: 'color: #FFC107; font-weight: bold; padding: 1px 0;',
        timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
      },
      {
        logType: LogTypeEnum.ERROR,
        tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #F44336; padding: 1px 5px; margin-left: 2px;',
        textStyle: 'color: #F44336; font-weight: bold; padding: 1px 0;',
        timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
      },
      {
        logType: LogTypeEnum.TRACE,
        tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #757575; padding: 1px 5px; margin-left: 2px;',
        textStyle: 'color: #BDBDBD; font-weight: bold; padding: 1px 0;',
        timeStyle: 'color: #9E9E9E; font-weight: bold; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; font-weight: normal; padding: 1px 0;'
      }
    ]
  };
}
