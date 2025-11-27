import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { environment } from '../../environments/environment';
import { Invoice } from '../interface/invoice.models';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInvoiceProviderService {

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  private apiUrl = environment.apiURL
  private invoiceEndpoint = "invoices"

  public getInvoiceListByPatientId(id: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl + this.invoiceEndpoint + "/patients/" + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Invoice[]) => response),
      catchError(this.authService.handleError)
    )
  }

  public getInvoiceByPatientId(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(this.apiUrl + this.invoiceEndpoint + "/" + id,
      this.authService.getAuthHeaders()
    )
    .pipe(
      map((response: Invoice) => response),
      catchError(this.authService.handleError)
    )
  }
}
