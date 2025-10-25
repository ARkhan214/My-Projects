import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = environment.springUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  getProfile(): Observable<Employee> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<Employee>(`${environment.springUrl}/employees/profile`, { headers });
  }

  // view account info
  getAllAccountById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`);
  }

  //Sob account dekhar jonno (related with ViewAllAccounts.ts er loadData methode)
  getAllAccount(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees/all`);
  }

    // Total Salary 
  getTotalSalary(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/employees/total-salary`);
  }

  //its working for create Employee on Employee Component
  registerEmployee(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/`, formData);
  }


}
