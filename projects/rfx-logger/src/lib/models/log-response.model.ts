import { HttpResponse, HttpErrorResponse } from "@angular/common/http";

/**
 * Advanced interceptor http response.
 * This object can carry additional "timeMs" field
 */
export interface LogResponseModel {
  /**
   * Response time in milliseconds
   */
  timeMs: number;

  /**
   * Http response. Can be success or error
   */
  response: HttpResponse<any> | HttpErrorResponse;
}
