import { Component } from '@angular/core';
import { RfxLoggerService } from '../../../rfx-logger/src/lib/rfx-logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public customMessage: string;
  public debugData: Array<string>;
  public isDebugDataDisabled: boolean;

  constructor(private rfxLoggerService: RfxLoggerService) {
    this.debugData = ['this', 'is', 'a', 'nice', 'test'];
  }

  private getCustomMessage(): string {
    return this.customMessage ? this.customMessage : 'your message';
  }

  private getDebugData(): Array<string> {
    return this.isDebugDataDisabled ? undefined : this.debugData;
  }

  public toggleDebugData(): void {
    this.isDebugDataDisabled = !this.isDebugDataDisabled;
  }

  public rfxLoggerSuccess(): void {
    this.rfxLoggerService.success(this.getCustomMessage(), this.getDebugData());
  }

  public rfxLoggerWarning(): void {
    this.rfxLoggerService.warning(this.getCustomMessage(), this.getDebugData());
  }

  public rfxLoggerError(): void {
    this.rfxLoggerService.error(this.getCustomMessage(), this.getDebugData());
  }

}
