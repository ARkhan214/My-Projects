import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoanDTO } from '../model/loanDTO.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = 'http://localhost:8085/api/loans/myloans';
  private baseUrl = 'http://localhost:8085/api/admin/loans';    //For admin approval.

  constructor(private http: HttpClient) { }

  getMyLoans(): Observable<LoanDTO[]> {
    const token = localStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<LoanDTO[]>(this.apiUrl, { headers });
  }
  getAll(): Observable<LoanDTO[]> {

    return this.http.get<LoanDTO[]>(`${this.baseUrl}/all`);
  }





  // User loans
  // getMyLoans(): Observable<LoanDTO[]> {
  //   const token = localStorage.getItem('authToken') || '';
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get<LoanDTO[]>(this.apiUrl, { headers });
  // }

  // Admin: pending loans
  getPendingLoans(): Observable<LoanDTO[]> {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<LoanDTO[]>(`${this.baseUrl}/all`, { headers });
  }



  // Admin: approve loan
  approveLoan(loanId: number): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/${loanId}/approve`, {}, { headers });
  }

  // Admin: reject loan
  rejectLoan(loanId: number): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/${loanId}/reject`, {}, { headers });
  }










  //Way one start----------------


  //  Common function to set Authorization header
  // private getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('authToken');
  //   let headers = new HttpHeaders();
  //   if (token) {
  //     headers = headers.set('Authorization', `Bearer ${token}`);
  //   }
  //   return headers;
  // }

  //  Get Pending Loans
  // getPendingLoans(): Observable<any> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get(`${this.baseUrl}/pending`, { headers });
  // }

  //  Approve Loan
  // approveLoan(loanId: number): Observable<any> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post(`${this.baseUrl}/${loanId}/approve`, {}, { headers });
  // }

  //  Reject Loan
  // rejectLoan(loanId: number): Observable<any> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.post(`${this.baseUrl}/${loanId}/reject`, {}, { headers });
  // }

  //Way one end----------------


  //Way two start----------------

  // getPendingLoans(token: string): Observable<any> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get(`${this.baseUrl}/pending`, { headers });
  // }

  // approveLoan(token: string, loanId: number): Observable<any> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.post(`${this.baseUrl}/${loanId}/approve`, {}, { headers });
  // }

  // rejectLoan(token: string, loanId: number): Observable<any> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.post(`${this.baseUrl}/${loanId}/reject`, {}, { headers });
  // }

  //Way two end----------------

}
