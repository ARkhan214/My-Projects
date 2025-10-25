import { Injectable } from '@angular/core';
import { environment } from '../api/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoliceStation } from '../model/police-station.model';

@Injectable({
  providedIn: 'root'
})
export class PolicestationService {
  
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http:HttpClient
  ){}


savePoliceStation(policeStation:PoliceStation):Observable<PoliceStation>{
  return this.http.post<PoliceStation>(this.apiUrl+"/api/policestations/",policeStation);
}


getPoliceStationByDistrictId(id:number):Observable<PoliceStation[]>{
  return this.http.get<PoliceStation[]>(this.apiUrl+"/api/policestations/district/"+id);
}

}
