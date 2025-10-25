import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deposit } from '../model/deposit.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
private baseUrl =environment.springUrl;


  constructor(private http: HttpClient) { }

 
  saveDeposit(deposit: Deposit): Observable<any>{
   return this.http.post(this.baseUrl, deposit);
  }

  //  Read All (GET)
  getAllDeposits(): Observable<Deposit[]> {
    return this.http.get<Deposit[]>(this.baseUrl);
  }

  //  Read by ID (GET)
  getDepositById(id: number): Observable<Deposit> {
    return this.http.get<Deposit>(`${this.baseUrl}/${id}`);
  }
  
  updateDeposit(id: number, deposit: Deposit): Observable<Deposit> {
    return this.http.put<Deposit>(`${this.baseUrl}/${id}`, deposit);
  }


  deleteDeposit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
