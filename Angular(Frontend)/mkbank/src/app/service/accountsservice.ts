import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Accounts } from '../model/accounts.model';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { AuthService } from './auth-service';
import { isPlatformBrowser } from '@angular/common';
import { AccountsDTO } from '../model/accountsDTO.model';

@Injectable({
  providedIn: 'root'
})
export class Accountsservice {

  private apiUrl = environment.springUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

    private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

    private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  // new method for close part
  depositToAccount(id: number, amount: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Accounts>(url).pipe(
      switchMap(account => {
        if (account.accountActiveStatus === false) {
          return throwError(() => new Error('This account is closed and cannot accept deposits.'));
        }
        account.balance += amount;
        return this.http.put<Accounts>(url, account);
      })
    );
  }



  // new method for close part

  withdrawFromAccount(id: number, amount: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Accounts>(url).pipe(
      switchMap(account => {
        if (account.accountActiveStatus === false) {
          return throwError(() => new Error('This account is closed and cannot withdraw money.'));
        }
        if (account.balance < amount) {
          return throwError(() => new Error('Insufficient balance'));
        }
        account.balance -= amount;
        return this.http.put<Accounts>(url, account);
      })
    );
  }



  // new method for close part
  closeAccount(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Accounts>(url).pipe(
      switchMap(account => {
        account.accountActiveStatus = false;
        return this.http.put(url, account);
      })
    );
  }

  //  Reactivate or Open account
  openAccount(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Accounts>(url).pipe(
      switchMap(account => {
        account.accountActiveStatus = true;  //  status change
        return this.http.put(url, account);
      })
    );
  }


  //Sob account dekhar jonno (related with ViewAllAccounts.ts er loadData methode)
  // getAllAccount(): Observable<AccountsDTO[]> {
  //   return this.http.get<AccountsDTO[]>(`${this.apiUrl}/account/all`);
  // }

  getAllAccount(): Observable<AccountsDTO[]> {
    return this.http.get<AccountsDTO[]>(`${this.apiUrl}/account/all`);
  }

  //for admin dashbord
  getAllAccounts(): Observable<Accounts[]> {
    return this.http.get<Accounts[]>(`${this.apiUrl}/account/all`);
  }


  // view account info
  getAllAccountById(id: number): Observable<Accounts> {
    return this.http.get<Accounts>(`${this.apiUrl}/account/${id}`);
  }


  getProfile(): Observable<Accounts> {
    
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
     
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<Accounts>(`${environment.springUrl}/account/profile`, { headers });
  }




  addAccount(account: Accounts): Observable<Accounts> {
    return this.http.post<Accounts>(this.apiUrl, account);
  }

  getAccountsByUserId(userId: number): Observable<Accounts[]> {
    return this.http.get<Accounts[]>(`${this.apiUrl}?userId=${userId}`);
  }

  findAccountByUserId(userId: number): Observable<Accounts | null> {
    return this.getAccountsByUserId(userId).pipe(
      map(accounts => accounts.length > 0 ? accounts[0] : null)
    );
  }









  updateAccount(id: number, account: Accounts): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }





  //its working for create account on usercomponent
  registerAccount(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/account/`, formData);
  }


    // Receiver accounts data load
  getAccountById(receiverId: number): Observable<Accounts> {
    return this.http.get<Accounts>(`${this.apiUrl}/account/receiver/${receiverId}`);
  }
}
