import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../model/address.model';
import { environment } from '../api/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl=environment.apiUrl;

    constructor(
    private http: HttpClient,
    private router: Router

  ) { }

    // Fetch all addresses
  getAllAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl+"/api/address/");
  }

  // Save new address
  saveAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl+"/api/address/", address);
  }

}
