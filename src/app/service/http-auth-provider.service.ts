import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { LoginRequest, LoginResponse } from '../interface/user.models';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthProviderService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private apiUrl = environment.apiURL
  private loginEndpoint = "auth/login"

  public logUser(model: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + this.loginEndpoint, model)
      .pipe(
        map((response: LoginResponse) => this.authService.handleAuthentication(response)),
        catchError(this.authService.handleLoginError)
      )
  }
}
