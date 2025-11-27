import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { environment } from '../../environments/environment';
import { Patient } from '../interface/user.models';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpPatientProviderService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private apiUrl = environment.apiURL
  private patientEndpoint = "patients"

  public getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl + this.patientEndpoint,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Patient[]) => response),
      catchError(this.authService.handleError)
    )
  }

  public getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(this.apiUrl + this.patientEndpoint + "/" + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Patient) => response),
      catchError(this.authService.handleError)
    )
  }

  public createPatient(model: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl + this.patientEndpoint,
      model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Patient) => response),
      catchError(this.authService.handleError)
    )
  }

  public updatePatient(model: Patient): Observable<Patient> {
    return this.http.patch<Patient>(this.apiUrl + this.patientEndpoint,
      model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Patient) => response),
      catchError(this.authService.handleError)
    )
  }
}
