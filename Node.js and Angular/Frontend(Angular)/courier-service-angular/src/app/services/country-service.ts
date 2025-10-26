import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../api/environment';
import { Observable } from 'rxjs';
import { Country } from '../model/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  
private apiUrl=environment.apiUrl;

constructor(
  private http:HttpClient,
  private router:Router
){}



  saveCountry(country: Country): Observable<Country> {

    return this.http.post<Country>(this.apiUrl+"/api/countries/", country);

  }

  getAllCountry():Observable<Country[]>{

    return this.http.get<Country[]>(this.apiUrl+"/api/countries/");

  }


// saveCountry(country:any): Observable<any> {
//   return this.http.post<any>(this.apiurl+"/api/countries",)
// }


}
