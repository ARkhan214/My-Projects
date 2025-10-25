import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth-service';
import { Role } from '../../model/role.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {


  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  //eta amar first silo.eta kaj kore.
  // ngOnInit(): void {
  //   this.authService.userRole$.subscribe(role => {
  //     this.userRole = role;
  //     console.log('Sidebar loaded with role:', this.userRole);
  //   });
  // }

  //eta sadier vi er theke ansi etao kaj kore.(etar kaj sidebar er error remove kora)
  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      //  Safe to access localStorage in browser
      this.userRole = localStorage.getItem('userRole');

      this.authService.userRole$.subscribe(role => {
        this.userRole = role;
        console.log('Sidebar loaded with role:', this.userRole);
        this.cdr.markForCheck();
      });

      // Optional: reload from localStorage on refresh
      const roleFromStorage = localStorage.getItem('userRole');
      if (roleFromStorage) {
        this.userRole = roleFromStorage;
      }
    }
  }


  logout() {
    this.authService.logout();
  }


  isAdmin(): boolean {
    return this.userRole === Role.ADMIN;
  }

  isUser(): boolean {
    return this.userRole === Role.USER;
  }

  isEmployee(): boolean {
    return this.userRole === Role.EMPLOYEE;
  }


  isLoggIn(): boolean {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      return true;
    }
    this.authService.logout();
    return false;

  }
}
