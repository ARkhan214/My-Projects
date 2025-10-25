import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { User } from '../model/user.model';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse } from '../model/authResponse.model';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { Role } from '../model/role.model';
import { AlertService } from './alert-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.springUrl;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });


  // userRoleSubject type now uses enum
  private userRoleSubject: BehaviorSubject<Role | null> = new BehaviorSubject<Role | null>(null);
  public userRole$: Observable<Role | null> = this.userRoleSubject.asObservable();

  // userRole: string | null = null;

  constructor(
    private alertService: AlertService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Load role from localStorage on service init
    this.loadUserRoleFromStorage();
  }


  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadUserRoleFromStorage() {
    if (this.isBrowser()) {
      const role = localStorage.getItem('userRole') as Role | null;
      if (role) {
        this.userRoleSubject.next(role);
      }
    }
  }



  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl + '/user/login', { email, password }, { headers: this.headers }).pipe(
      map((response: AuthResponse) => {
        if (this.isBrowser() && response.token) {
          localStorage.setItem('authToken', response.token);

          // Decode JWT token
          const decodeToken = this.decodeToken(response.token);

          // Use enum Role
          const role: Role = decodeToken.role as Role;
          this.setUserRole(role);
        }
        return response;
      })
    );
  }

  // setUserRole using enum
  setUserRole(role: Role) {
    this.userRoleSubject.next(role);
    if (this.isBrowser()) {
      localStorage.setItem('userRole', role);
    }
  }

  // getUserRole returns enum
  getUserRole(): Role | null {
    if (this.isBrowser()) {
      const role = localStorage.getItem('userRole');
      return role as Role | null;
    }
    return null;
  }



  decodeToken(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));

  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    const docodeToken = this.decodeToken(token);

    const expiry = docodeToken.exp * 1000;
    return Date.now() > expiry;
  }

  isLoggIn(): boolean {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      return true;
    }
    this.logout();
    return false;

  }


  logout(): void {
    if (this.isBrowser()) {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');

      if (!token || !role) {
        this.alertService.warning('You are not logged in!', 'Logout Failed');
        return;
      }

      // browser built-in confirm dialog
      const confirmed = window.confirm('Do you really want to logout?');

      if (confirmed) {
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
        this.userRoleSubject.next(null);

        this.router.navigate(['/']).then(() => {
          // SweetAlert success message
          this.alertService.success('You have been logged out successfully!', 'Logged Out');
        });
      } else {
        // SweetAlert info message
        this.alertService.info('Logout cancelled', 'Cancelled');
      }
    }
  }



  // logout(): void {
  //   if (!this.isBrowser()) return;

  //   const token = localStorage.getItem('authToken');
  //   const role = localStorage.getItem('userRole');

  //   if (!token || !role) {
  //     this.alertService.warning('You are not logged in!', 'Logout Failed');
  //     return;
  //   }

  //   const confirmed = window.confirm('Do you really want to logout?');

  //   if (confirmed) {
  //     localStorage.removeItem('authToken');
  //     localStorage.removeItem('userRole');
  //     this.userRoleSubject.next(null);

  //     this.router.navigate(['/']).then(() => {
  //       this.alertService.success('You have been logged out successfully!', 'Logged Out');
  //     });
  //   } else {
  //     this.alertService.info('Logout cancelled', 'Cancelled');
  //   }
  // }



  // logout(): void {
  //   if (this.isBrowser()) {
  //     const token = localStorage.getItem('authToken');
  //     const role = localStorage.getItem('userRole');

  //     if (!token || !role) {
  //       this.alertService.warning('You are not logged in!', 'Logout Failed');
  //       return;
  //     }

  //     this.alertService.confirm('Do you really want to logout?', 'Logout Confirmation')
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           localStorage.removeItem('userRole');
  //           localStorage.removeItem('authToken');
  //           this.userRoleSubject.next(null);

  //           this.router.navigate(['/']).then(() => {
  //             this.alertService.success('You have been logged out successfully!', 'Logged Out');
  //           });
  //         } else {
  //           this.alertService.info('Logout cancelled', 'Cancelled');
  //         }
  //       });
  //   }
  // }



  // logout(): void {
  //   if (this.isBrowser()) {
  //     // alert('You have been logged out successfully!');
  //     this.alertService.confirm('');
  //     localStorage.removeItem('userRole');
  //     localStorage.removeItem('authToken');
  //     this.userRoleSubject.next(null);
  //   }
  //   this.router.navigate(['/']);
  // }


  hasRole(roles: Role[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }


  //Guard Section(For Guard)---Start---
  // auth-service.ts
  isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN;
  }

  isUser(): boolean {
    return this.getUserRole() === Role.USER;
  }

  isEmployee(): boolean {
    return this.getUserRole() === Role.EMPLOYEE;
  }

  //Guard Section(For Guard)---end---
}
