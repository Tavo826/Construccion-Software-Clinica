import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpAuthProviderService } from './http-auth-provider.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth/auth.service';
import { Employee } from '../interface/user.models';
import { catchError, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpEmployeeProviderService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private apiUrl = environment.apiURL
  private employeeEndpoint = "employees"

  public getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl + this.employeeEndpoint,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Employee[]) => response),
      catchError(this.authService.handleError)
    )
  }

  public getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(this.apiUrl + this.employeeEndpoint + "/" + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Employee) => response),
      catchError(this.authService.handleError)
    )
  }

  public createEmployee(model: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl + this.employeeEndpoint,
      model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Employee) => response),
      catchError(this.authService.handleError)
    )
  }

  public updateEmployee(model: Employee): Observable<Employee> {
    return this.http.patch<Employee>(this.apiUrl + this.employeeEndpoint,
      model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Employee) => response),
      catchError(this.authService.handleError)
    )
  }

  public deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + this.employeeEndpoint + "/" + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: any) => response),
      catchError(this.authService.handleError)
    )
  }
}
