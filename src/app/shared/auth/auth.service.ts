import { inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interface/user.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = "token"
  private role_key = "role_key"

  private router = inject(Router)

  constructor() {
    
  }

  getToken (): string | null {
    return localStorage.getItem(this.token);
  }

  getRole (): string | null {
    return localStorage.getItem(this.role_key)
  }

  isLoggedIn = (): boolean => {
    return !!this.getToken();
  }

  logout = (): void => {

    localStorage.removeItem(this.token)
    localStorage.removeItem(this.role_key)
    this.router.navigate(['/Login'])
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  handleAuthentication (response: LoginResponse): LoginResponse {

    localStorage.setItem(this.token, response.token)
    const role = this.getRoleFromToken() || ""
    localStorage.setItem(this.role_key, role)

    return response
  }

  handleLoginError (error: any) {
    let errorMessage = "An error ocurred in the request"

    console.log("error: ", error)

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error?.detail}`
    } else if (error.status) {

      if (error.status === 401) {
        errorMessage = 'Invalid credentials'
      } else {
        errorMessage = `${error.status} - ${error.error?.detail || error.error?.title}`
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  handleError = (error: any) => {
    let errorMessage = "An error ocurred in the request"

    console.log("error: ", error)

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error?.detail}`
    } else if (error.status) {
      errorMessage = `${error.status} - ${error.error?.detail || error.error?.title}`

      if (error.status === 401 || error.status == 403) {
        this.logout()
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  dateFormatter (date: string): string {

    const splitDate = date.split('-')    
    return splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0]
  }

  private getRoleFromToken(): string | null {
    const token = this.getToken()

    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        const payload = JSON.parse(jsonPayload)

        return payload.role
      } catch (e) {
        this.logout()
        return null
      }
    }

    return null
  }
}
