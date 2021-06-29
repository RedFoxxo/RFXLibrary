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
    // disableHttpCodes: false,
    // disableHttpCallDuration: false,
    // disableTime: false,
    // devEnabledLogs: [
    //   LogTypeEnum.SUCCESS,
    //   LogTypeEnum.WARNING,
    //   LogTypeEnum.ERROR,
    //   LogTypeEnum.TRACE
    // ],
    // prodEnabledLogs: [
    //   LogTypeEnum.SUCCESS,
    //   LogTypeEnum.ERROR
    // ],
    colorsConfig: [
      {
        logType: LogTypeEnum.SUCCESS,
        textStyle: 'color: #8BC34A; font-weight: bold; padding: 1px 0;',
        tagStyle: 'color: #000000; font-weight: bold; background-color: #8BC34A; padding: 1px 5px;',
        timeStyle: 'color: #9E9E9E; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
      },
      {
        logType: LogTypeEnum.WARNING,
        textStyle: 'color: #FFC107; font-weight: bold; padding: 1px 0;',
        tagStyle: 'color: #000000; font-weight: bold; background-color: #FFC107; padding: 1px 5px;',
        timeStyle: 'color: #9E9E9E; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
      },
      {
        logType: LogTypeEnum.ERROR,
        textStyle: 'color: #F44336; font-weight: bold; padding: 1px 0;',
        tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #F44336; padding: 1px 5px;',
        timeStyle: 'color: #9E9E9E; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
      },
      {
        logType: LogTypeEnum.TRACE,
        textStyle: 'color: #BDBDBD; font-weight: bold; padding: 1px 0;',
        tagStyle: 'color: #FFFFFF; font-weight: bold; background-color: #757575; padding: 1px 5px;',
        timeStyle: 'color: #9E9E9E; padding: 1px 0;',
        responseTimeStyle: 'color: #9E9E9E; padding: 1px 0;'
      }
    ]
  };
}
