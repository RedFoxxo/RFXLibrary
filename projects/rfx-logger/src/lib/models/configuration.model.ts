import { LogTypeEnum } from "./log-type.enum";
import { MessageStyleModel } from "./message-style.model";

export class ConfigurationModel {
  // disableLogger?: boolean;
  disableVerbose?: boolean;
  // disableHttpCodes?: boolean;
  // disableHttpCallDuration?: boolean;
  // disableTime?: boolean;
  // devEnabledLogs?: (LogTypeEnum | string)[];
  // prodEnabledLogs?: (LogTypeEnum | string)[];
  colorsConfig?: MessageStyleModel[];
}
