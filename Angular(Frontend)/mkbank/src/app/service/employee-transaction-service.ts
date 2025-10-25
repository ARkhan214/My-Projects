import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transaction } from '../model/transactions.model';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTransactionService {
 private baseUrl = environment.springUrl + '/transactions';


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }



  // Deposit / Add Transaction
  depositAndWithdrawHandel(transaction: Transaction, accountId: number): Observable<Transaction> {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post<Transaction>(`${this.baseUrl}/tr/${accountId}`, transaction, { headers });
  }


  // withdraw(transaction: Transaction, accountId: number): Observable<Transaction> {
  //   let headers = new HttpHeaders();
  //   if (isPlatformBrowser(this.platformId)) {
  //     const token = localStorage.getItem('authToken');
  //     if (token) {
  //       headers = headers.set('Authorization', 'Bearer ' + token);
  //     }
  //   }

  //   return this.http.post<Transaction>(`${this.baseUrl}/tr/${accountId}`, transaction, { headers });
  // }


  // Transfer Transaction (Employee can transfer between accounts)
  transfer(transaction: Transaction, senderId: number, receiverId: number): Observable<Transaction> {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post<Transaction>(`${this.baseUrl}/tr/${senderId}/${receiverId}`,transaction,{ headers });
  }

}
