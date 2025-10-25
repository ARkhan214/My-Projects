import { Injectable } from '@angular/core';
import { environment } from '../api/environment';
import { HttpClient } from '@angular/common/http';
import { District } from '../model/district.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  

  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http:HttpClient
  ){}

saveDistrict(district:District):Observable<District>{
  return this.http.post<District>(this.apiUrl+"/api/districts/",district);
}


getDistrictByCountryId(id:number):Observable<District>{
  return this.http.get<District>(this.apiUrl+"/api/districts/division/"+id);
}

}
