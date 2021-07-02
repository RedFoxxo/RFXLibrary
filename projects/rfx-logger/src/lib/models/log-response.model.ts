import { HttpResponse, HttpErrorResponse } from "@angular/common/http";

export interface LogResponseModel {
  timeMs: number;
  response: HttpResponse<any> | HttpErrorResponse;
}
