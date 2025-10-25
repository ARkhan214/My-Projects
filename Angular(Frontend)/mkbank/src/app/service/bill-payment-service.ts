import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../model/transactions.model';

@Injectable({
  providedIn: 'root'
})
export class BillPaymentService {

private baseUrl = 'http://localhost:8085/api/transactions';

  constructor(private http: HttpClient) { }

  payWater(payload: any, token: string): Observable<Transaction> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Transaction>(`${this.baseUrl}/pay/water`, payload, { headers });
  }

  
  payElectricity(payload: any, token: string): Observable<Transaction> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Transaction>(`${this.baseUrl}/pay/electricity`, payload, { headers });
  }

  payGas(payload: any, token: string): Observable<Transaction> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Transaction>(`${this.baseUrl}/pay/gas`, payload, { headers });
  }

  payInternet(payload: any, token: string): Observable<Transaction> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Transaction>(`${this.baseUrl}/pay/internet`, payload, { headers });
  }

  payMobile(payload: any, token: string): Observable<Transaction> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Transaction>(`${this.baseUrl}/pay/mobile`, payload, { headers });
  }

  payCreditCard(payload: any, token: string): Observable<Transaction> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Transaction>(`${this.baseUrl}/pay/credit-card`, payload, { headers });
  }
}
