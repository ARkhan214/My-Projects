import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../api/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  
private apiurl=environment.apiUrl;

constructor(
  private http:HttpClient,
  private router:Router
){}


// saveCountry(country:any): Observable<any> {
//   return this.http.post<any>(this.apiurl+"/api/countries",)
// }


}
