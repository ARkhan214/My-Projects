import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MultiRoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      
    
      if (user.type === 'user' || user.type === 'admin') {
        return true;
      }
    }

    
    this.router.navigate(['/login']);
    return false;
  }
}
