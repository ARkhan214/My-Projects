import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Accountsservice } from '../../service/accountsservice';
import { Accounts } from '../../model/accounts.model';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile implements OnInit {
 
  admin!: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService:AuthService,
    private cdr: ChangeDetectorRef
  ) { }

ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.admin = data;
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


}
