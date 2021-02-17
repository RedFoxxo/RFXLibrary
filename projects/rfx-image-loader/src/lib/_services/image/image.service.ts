import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    private httpClient: HttpClient
  ) { }

  public getImage(url: string): Observable<string | null> {
    return this.httpClient
      .get(url, { responseType: 'blob' })
      .pipe(switchMap(async (response: Blob) => {
        return await this.blobToImage(response);
      }))
  }

  private blobToImage(blob: Blob): Promise<string | null> {
    return new Promise((resolve) => {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result ? reader.result.toString() : null);
      }
    })
  }
}
