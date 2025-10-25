import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user.model';
import { AuthResponse } from '../../model/authResponse.model';
import { AuthService } from '../../service/auth-service';
import { Role } from '../../model/role.model';
import { AlertService } from '../../service/alert-service';
import { json } from 'stream/consumers';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  user: Partial<User> = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }


  onSubmit() {
    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Email and password are required!';
      return;
    }

    this.authService.login(this.user.email, this.user.password).subscribe({
      next: (response: AuthResponse) => {
        console.log("Login successful:", response);
        this.alertService.success('Login successful');
        this.successMessage = response.message;
        this.errorMessage = '';

        // Decode token for account id if needed
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const accountId = payload.id;
        console.log("Account id:", accountId);




        // Redirect by role
        const role: Role = payload.role as Role;

        if (role === Role.ADMIN) {
          this.router.navigate(['/admin-profile']);
        } else if (role === Role.EMPLOYEE) {
          this.router.navigate(['/employee-profile']);
        } else if (role === Role.USER) {

          this.router.navigate(['/account-profile']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error("Login failed:", err);
        this.errorMessage = "Invalid email or password!";
        this.successMessage = '';
      }
    });
  }

  onReset(): void {
  this.user = {
    email: '',
    password: ''
  };
  this.errorMessage = '';
  this.successMessage = '';
}


  // const userInfo = {


  //   id: '',
  //   name: '',
  //   accountActiveStatus:'',
  //   accountType:'' ,
  //   balance: '',
  //   nid: '',
  //   phoneNumber: '',
  //   address: '',
  //   photo: '',
  //   dateOfBirth: '', 
  //   accountOpeningDate: '',
  //   accountClosingDate: '',
  //   role: '',


  // };










}
