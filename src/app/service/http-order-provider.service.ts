import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { environment } from '../../environments/environment';
import { Order } from '../interface/order.models';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpOrderProviderService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private apiUrl = environment.apiURL
  private employeeEndpoint = "orders"

  public getOrderByPatientId(id: number): Observable<Order> {
    return this.http.get<Order>(this.apiUrl + this.employeeEndpoint + "/" + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Order) => response),
      catchError(this.authService.handleError)
    )
  }

  public createOrder(model: Order): Observable<any> {
    return this.http.post<any>(this.apiUrl + this.employeeEndpoint,
      model,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: any) => response),
      catchError(this.authService.handleError)
    )
  }
}
