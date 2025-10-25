import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { Accountsservice } from '../../service/accountsservice';
import { Accounts } from '../../model/accounts.model';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {

  accountId!: number;
  account!: Accounts;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: Accountsservice,
    private cdr:ChangeDetectorRef
  ) { }

    ngOnInit(): void {
    this.accountService.getProfile().subscribe({
      next: (data) => {
        this.account = data;
        console.log(data);
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });
  }


  logout() {
    alert('You have been logged out successfully!');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  viewStatement(): void {
    this.router.navigate(['/trst'], { queryParams: { accountId: this.account.id } });
  }



}
