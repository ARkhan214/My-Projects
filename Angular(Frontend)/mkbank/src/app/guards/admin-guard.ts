import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

 constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
    console.log('Checking AdminGuard. Current Role:', this.authService.getUserRole());

    if (this.authService.isAdmin()) {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }


  //---------------------------------

  // constructor(private router: Router) {}

  // canActivate(): boolean {
  //   const data = localStorage.getItem('loggedInUser');
  //   if (data) {
  //     const user = JSON.parse(data);
  //     if (user.type === 'admin') {
  //       console.log('Admin access granted');
  //       return true;
  //     }
  //   }

  //   console.warn('Admin access denied');
  //   this.router.navigate(['/login']);
  //   return false;
  // }
}
