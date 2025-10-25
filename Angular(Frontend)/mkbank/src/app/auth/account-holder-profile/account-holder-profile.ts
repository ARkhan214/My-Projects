import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Accounts } from '../../model/accounts.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Accountsservice } from '../../service/accountsservice';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-account-holder-profile',
  standalone: false,
  templateUrl: './account-holder-profile.html',
  styleUrl: './account-holder-profile.css'
})
export class AccountHolderProfile implements OnInit {

  account!: Accounts;

  profileSections: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: Accountsservice,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.accountService.getProfile().subscribe({
      next: (data) => {
        this.account = data;

        // Section-wise data
        this.profileSections = [
          {
            title: 'Personal Information',
            open: false,
            items: [
              { label: 'NID', value: this.account.nid },
              { label: 'Phone Number', value: this.account.phoneNumber },
              { label: 'Address', value: this.account.address },
              { label: 'Opening Date', value: this.account.accountOpeningDate ? new Date(this.account.accountOpeningDate).toLocaleDateString() : '-' },
            ]
          },
          {
            title: 'Account Details',
            open: false,
            items: [
              { label: 'Account Type', value: this.account.accountType },
              { label: 'Date Of Birth', value: this.account.dateOfBirth ? new Date(this.account.dateOfBirth).toLocaleDateString() : '-' },
              { label: 'Closing Date', value: this.account.accountClosingDate && !this.account.accountActiveStatus ? new Date(this.account.accountClosingDate).toLocaleDateString() : 'Currently Active' }
              ,
            ]
          }
        ];

        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  logout() {
    this.authService.logout();
  }

  //------------------------------------old Part-----

  // account!: Accounts;

  // constructor(
  //   private router: Router,
  //   private route: ActivatedRoute,
  //   private accountService: Accountsservice,
  //   private authService: AuthService,
  //   private cdr: ChangeDetectorRef,
  // ) { }

  // ngOnInit(): void {
  //   this.accountService.getProfile().subscribe({
  //     next: (data) => {
  //       this.account = data;
  //       console.log(data + "Profile data ");
  //       this.cdr.markForCheck();

  //     },
  //     error: (err) => {
  //       console.error('Failed to load profile', err);
  //     }
  //   });
  // }

  // encodeURL(fileName: string): string {
  //   return encodeURIComponent(fileName);
  // }


  // logout() {
  //   this.authService.logout();
  // }

}
