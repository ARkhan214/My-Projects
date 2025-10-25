import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth-service';
import { EmployeeService } from '../../service/employee-service';
import { Employee } from '../../model/employee.model';

@Component({
  selector: 'app-employee-profile',
  standalone: false,
  templateUrl: './employee-profile.html',
  styleUrl: './employee-profile.css'
})
export class EmployeeProfile {
employee!: Employee;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService,
    private employeeService:EmployeeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.employeeService.getProfile().subscribe({
      next: (data) => {
        this.employee = data;
        console.log(data);
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
  // logout() {
  //   alert('You have been logged out successfully!');
  //   localStorage.removeItem('loggedInUser');
  //   window.location.href = '/login';
  // }
}
