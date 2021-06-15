import { Component } from '@angular/core';
import { RfxLoggerService } from 'rfx-logger';

@Component({
  templateUrl: './rfx-logger.component.html',
  styleUrls: ['./rfx-logger.component.less']
})
export class RfxLoggerComponent {
  public customMessage: string;
  public debugData: any;
  public isDebugDataDisabled: boolean;
  public messageSent: boolean;

  constructor(private rfxLoggerService: RfxLoggerService) {
    this.debugData = ['example', 'data', 'in', 'array'];
    this.customMessage = '';
    this.isDebugDataDisabled = false;
    this.messageSent = false;
  }

  private getCustomMessage(): string {
    return this.customMessage ? this.customMessage : 'your message';
  }

  private getDebugData(): string[] | undefined {
    return this.isDebugDataDisabled ? undefined : this.debugData;
  }

  public toggleDebugData(): void {
    this.isDebugDataDisabled = !this.isDebugDataDisabled;
  }

  public rfxLoggerSuccess(): void {
    this.rfxLoggerService.success(this.getCustomMessage(), this.getDebugData());
    this.messageSent = true;
  }

  public rfxLoggerWarning(): void {
    this.rfxLoggerService.warning(this.getCustomMessage(), this.getDebugData());
    this.messageSent = true;
  }

  public rfxLoggerError(): void {
    this.rfxLoggerService.error(this.getCustomMessage(), this.getDebugData());
    this.messageSent = true;
  }

}
