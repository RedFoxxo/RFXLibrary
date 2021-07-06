import { LogTypeEnum } from "./log-type.enum";
import { LogStyleModel } from "./log-style.model";

export class ConfigurationModel {
  disableLogger?: boolean;
  disableVerbose?: boolean;
  // disableHttpCodes?: boolean;
  disableHttpCallDuration?: boolean;
  disableTime?: boolean;
  enabledLogTypes?: (LogTypeEnum | string)[];
  colorsConfig?: LogStyleModel[];
}
