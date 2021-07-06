import { LogTypeEnum } from "./log-type.enum";
import { LogStyleModel } from "./log-style.model";

/**
 * Package configuration model
 */
export class ConfigurationModel {
  /**
   * If true, completely disable all types of messages.
   * (default is false)
   */
  disableLogger?: boolean;

  /**
   * If true, logger doesn't print any debug data, just a one line message.
   * (default is false)
   */
  disableVerbose?: boolean;

  /**
   * If true, logger doesn't show http code when http interceptor is used.
   * (default is false)
   */
  disableHttpCodes?: boolean;

  /**
   * If true, http calls duration are hidden
   * (default is false)
   */
  disableHttpCallDuration?: boolean;

  /**
   * If true, disable time inside console log.
   * (default is false)
   */
  disableTime?: boolean;

  /**
   * Enable only selected types of log. All logs are enabled by default.
   * (default is ['success', 'warning', 'error', 'trace'])
   */
  enabledLogTypes?: (LogTypeEnum | string)[];

  /**
   * Customize every message tag, text, time and http response time
   */
  colorsConfig?: LogStyleModel[];
}
