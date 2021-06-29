import { LogTypeEnum } from "./log-type.enum";
import { LogStyleModel } from "./log-style.model";

export class ConfigurationModel {
  production?: boolean;
  disableLoggerInDevelopment?: boolean;
  disableLoggerInProduction?: boolean;
  disableVerboseInDevelopment?: boolean;
  disableVerboseInProduction?: boolean;
  // disableHttpCodesInDevelopment?: boolean;
  // disableHttpcodesInProduction?: boolean;
  // disableHttpCallDurationInDevelopment?: boolean;
  // disableHttpCallDurationInProduction?: boolean;
  disableTimeInDevelopment?: boolean;
  disableTimeInProduction?: boolean;
  developmentEnabledLogs?: (LogTypeEnum | string)[];
  productionEnabledLogs?: (LogTypeEnum | string)[];
  colorsConfig?: LogStyleModel[];
}
