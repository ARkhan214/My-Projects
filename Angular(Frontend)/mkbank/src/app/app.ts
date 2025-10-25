import { Component } from '@angular/core';
import { AuthService } from './service/auth-service';
import { Observable } from 'rxjs';
import { Role } from './model/role.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'mkbank';

  loginStatus$: Observable<Role | null>;

  constructor(public authService: AuthService) {
    this.loginStatus$ = this.authService.userRole$;
  }
}
