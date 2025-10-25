import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { FixedDeposit } from '../model/fixedDeposit.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FixedDepositService {

  private baseUrl = 'http://localhost:8085/api/fd/create'  // backend API base
  private apiUrl = 'http://localhost:8085/api/fd/my-fds';


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  private getToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }


  createFD(fd: FixedDeposit): Observable<FixedDeposit> {
    const token = this.getToken();
    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`
    });

    return this.http.post<FixedDeposit>(`${this.baseUrl}`, fd, { headers });
  }



  getMyFDs(): Observable<FixedDeposit[]> {
    const token = localStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<FixedDeposit[]>(this.apiUrl, { headers });
  }

  //   closeFD(fdId: number, accountId: number): Observable<FixedDeposit> {
  //   return this.http.post<FixedDeposit>(`http://localhost:8085/api/fd/close/${fdId}/${accountId}`, {});
  // }


  // fixed-deposit-service.ts
closeFD(fdId: number, accountId: number, headers: any) {
  return this.http.post(
    `http://localhost:8085/api/fd/close/${fdId}/${accountId}`,
    {}, // Body empty
    { headers } // Pass Authorization header
  );
}

}
