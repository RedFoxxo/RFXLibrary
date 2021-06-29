import { LogTypeEnum } from "./log-type.enum";
import { LogStyleModel } from "./log-style.model";

export class ConfigurationModel {
  production?: boolean;
  disableLogger?: boolean;
  disableVerbose?: boolean;
  // disableHttpCodes?: boolean;
  // disableHttpCallDuration?: boolean;
  disableTime?: boolean;
  devEnabledLogs?: (LogTypeEnum | string)[];
  prodEnabledLogs?: (LogTypeEnum | string)[];
  colorsConfig?: LogStyleModel[];
}
