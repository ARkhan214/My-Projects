import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Withdraw } from '../model/withdraw.model';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { Accounts } from '../model/accounts.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {

  private baseUrl = environment.springUrl;
  private accountUrl = environment.springUrl;


  constructor(private http: HttpClient) { }

  withdrawMony(withdraw: Withdraw): Observable<any> {

    const accountUrl = this.accountUrl;

    return this.http.get<Accounts>(accountUrl).pipe(

      switchMap((account: Accounts) => {
        if (!account) {
          return throwError(() => new Error('Account not found'));
        }

        if (account.balance < withdraw.amount) {
          return throwError(() => new Error('Insufficient balance'));
        }


        account.balance -= withdraw.amount
        return this.http.put<Accounts>(accountUrl, account).pipe(

          switchMap(() => {
            return this.http.post<Withdraw>(this.baseUrl, withdraw);

          })
        );

      })

    );

  }


  saveWithdraw(withdraw: Withdraw): Observable<Withdraw> {
    return this.http.post<Withdraw>(this.baseUrl, withdraw);
  }


  getAllWithdraws(): Observable<Withdraw[]> {
    return this.http.get<Withdraw[]>(this.baseUrl);
  }


  getWithdrawById(id: number): Observable<Withdraw> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Withdraw>(url);
  }


}
