import { Injectable } from '@angular/core';
import { environment } from '../api/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Division } from '../model/division.model';

@Injectable({
  providedIn: 'root'
})
export class DivitionService {
  
private apiUrl = `${environment.apiUrl}`;

constructor(
  private http:HttpClient
){}


saveDivision(division:Division):Observable<Division>{
  return this.http.post<Division>(this.apiUrl+"/api/divisions/",division);
}



getDivisionByCountryId(id:number):Observable<Division[]>{
  return this.http.get<Division[]>(this.apiUrl+"/api/divisions/country/"+id);
}

}
