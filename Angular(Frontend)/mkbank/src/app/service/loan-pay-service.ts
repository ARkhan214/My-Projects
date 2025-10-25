import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

  export interface LoanPaymentRequest {
  loanId: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoanPayService {

  constructor(
        private http: HttpClient
  ) { }

  
   payLoan(loanId: number, amount: number): Observable<any> {
    const token = localStorage.getItem('authToken'); // login token


     let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }


    const body: LoanPaymentRequest = { loanId, amount };
    return this.http.post<any>(`http://localhost:8085/api/loans/pay`, body, { headers });
  }
  
}
