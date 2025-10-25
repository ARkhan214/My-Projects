import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user.model';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environment/environment';
import { AuthResponse } from '../model/authResponse.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private baseUrl = environment.springUrl;

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,

  ) {

    const storedUser = this.isBrowser() ? JSON.parse(localStorage.getItem('loggedInUser') || 'null') : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

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


  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Set user after login
  setLoginUser(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      this.currentUserSubject.next(user); //update observable
    }
  }

  //user Registration with Spring Boot
  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/`, formData);
  }

  //new login after spring
  login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/user/login`, user);
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('loggedInUser');
      this.currentUserSubject.next(null); // update observable
    }
  }

  getLoginUser(): User | null {
    return this.currentUserSubject.value;
  }

  getLoginUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }


  //for admin dashbord (it's contain all users)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user/all`);
  }

  getAllUser(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user/${id}`);
  }

  saveAllUser(alluser: User): Observable<any> {
    return this.http.post(this.baseUrl, alluser);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/account/${id}`);
  }
  
  


  getProfile(): Observable<User> {

    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');      
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }
    return this.http.get<User>(`${environment.springUrl}/user/profile`, { headers });
  }





  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(this.baseUrl + '/' + id, user);
  }

}
