import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { environment } from '../../environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { RecordRequest, RecordResponse } from '../interface/record.model';

@Injectable({
  providedIn: 'root'
})
export class HttpRecordProviderService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private apiUrl = environment.apiURL
  private recordEndpoint = "records"

  public getRecordByPatientId(id: number): Observable<RecordResponse> {
    return this.http.get<RecordResponse>(this.apiUrl + this.recordEndpoint + "/" + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: RecordResponse) => response),
      catchError(this.authService.handleError)
    )
  }

  public createRecord(model: RecordRequest): Observable<RecordResponse> {
    return this.http.post<RecordResponse>(this.apiUrl + this.recordEndpoint,
      model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: RecordResponse) => response),
      catchError(this.authService.handleError)
    )
  }
}
