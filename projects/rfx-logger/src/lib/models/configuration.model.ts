import { LogTypeEnum } from "./log-type.enum";
import { MessageStyleModel } from "./message-style.model";

export class ConfigurationModel {
  production?: boolean;
  disableLogger?: boolean;
  disableVerbose?: boolean;
  // disableHttpCodes?: boolean;
  // disableHttpCallDuration?: boolean;
  disableTime?: boolean;
  devEnabledLogs?: (LogTypeEnum | string)[];
  prodEnabledLogs?: (LogTypeEnum | string)[];
  colorsConfig?: MessageStyleModel[];
}
