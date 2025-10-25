import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-forgot-password-component',
  standalone: false,
  templateUrl: './forgot-password-component.html',
  styleUrl: './forgot-password-component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private cdr:ChangeDetectorRef,
    private router: Router

  ) { }

  sendResetLink() {
    const formData = new URLSearchParams();
    formData.set('email', this.email);

    this.http.post('http://localhost:8085/api/user/forgot-password', formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .subscribe({
        next: (res: any) => {
          this.message = res.message;
          this.alertService.success('Check your email and Change your password');
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          this.message = 'Error sending reset link';
          this.alertService.error('Error sending reset link');
        }
      });

  }
}