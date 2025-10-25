import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Accountsservice } from '../../service/accountsservice';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { Accounts } from '../../model/accounts.model';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-view-all-accounts',
  standalone: false,
  templateUrl: './view-all-accounts.html',
  styleUrl: './view-all-accounts.css'
})
export class ViewAllAccounts implements OnInit {

  account: Accounts[] = [];
  filteredAccount: Accounts[] = [];
  // searchAccountId: number | null = null;

  //For Search----Start
  searchById: string = '';
  searchByNid: string = '';
  searchByPhone: string = '';
  // searchByAccountType: string = '';
  //For Search----End

  constructor(
    private accountService: Accountsservice,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.accountService.getAllAccounts().subscribe(accounts => {
      this.account = accounts;
      console.log("Accounts from API: ", this.account);
      this.filteredAccount = [...accounts];
      this.cdr.markForCheck();
    });
  }

  
  filterById(): void {
    if (!this.searchById) {
      this.filteredAccount = [...this.account];
    } else {
      const search = this.searchById.toLowerCase();
      this.filteredAccount = this.account.filter(a =>
        a.id?.toString() === search
      );
    }
    this.cdr.markForCheck();
  }

  filterByNid(): void {
    if (!this.searchByNid) {
      this.filteredAccount = [...this.account];
    } else {
      const search = this.searchByNid.toLowerCase();
      this.filteredAccount = this.account.filter(a =>
        a.nid?.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }

  filterByPhone(): void {
    if (!this.searchByPhone) {
      this.filteredAccount = [...this.account];
    } else {
      const search = this.searchByPhone.toLowerCase();
      this.filteredAccount = this.account.filter(a =>
        a.phoneNumber?.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }

  // filterAccounts(): void {
  //   if (this.searchAccountId === null) {
  //     this.filteredAccount = [...this.account]; // reset
  //   } else {
  //     this.filteredAccount = this.account.filter(acc =>
  //       acc.id === this.searchAccountId
  //     );
  //   }
  //   this.cdr.markForCheck();
  // }




  deleteAccount(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this account? This action cannot be undone.');

    if (!confirmed) {
      return; // user cancelled
    }

    this.accountService.deleteAccount(id).subscribe({
      next: () => {
        console.log('Account deleted');
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log('Error deleting User: ', err);
      }
    });
  }


  closeAccount(id: number): void {
    const conform = window.confirm('Are you sure you want to close this account?');
    if (!conform) {
      return;
    }


    this.accountService.closeAccount(id).subscribe({
      next: () => {
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log('Error closing account:', err);
      }
    });
  }

  openAccount(id: number): void {
    this.accountService.openAccount(id).subscribe({
      next: () => {
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log('Error opening account:', err);
      }
    });
  }

}
