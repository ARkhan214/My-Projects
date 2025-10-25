import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { Accountsservice } from '../../service/accountsservice';
import { Accounts } from '../../model/accounts.model';

@Component({
  selector: 'app-viewallusercomponent',
  standalone: false,
  templateUrl: './viewallusercomponent.html',
  styleUrl: './viewallusercomponent.css'
})
export class Viewallusercomponent implements OnInit {
  users: User[] = [];
  filteredUser: User[] = [];

  searchById: string = '';
  searchByEmail: string = '';
  searchByPhone: string = '';

  constructor(
    private userservice: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userservice.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUser = [...data]; // initially show all users
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  filterById(): void {
    if (!this.searchById) {
      this.filteredUser = [...this.users];
    } else {
      const search = this.searchById.toLowerCase();
      this.filteredUser = this.users.filter(u =>
        u.id?.toString() === search
      );
    }
    this.cdr.markForCheck();
  }

  filterByEmail(): void {
    if (!this.searchByEmail) {
      this.filteredUser = [...this.users];
    } else {
      const search = this.searchByEmail.toLowerCase();
      this.filteredUser = this.users.filter(u =>
        u.email.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }

  filterByPhone(): void {
    if (!this.searchByPhone) {
      this.filteredUser = [...this.users];
    } else {
      const search = this.searchByPhone.toLowerCase();
      this.filteredUser = this.users.filter(u =>
        u.phoneNumber.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }

  deleteUser(id: number): void {
    this.userservice.deleteUser(id).subscribe({
      next: () => {
        console.log('User deleted');
        this.loadData();
        this.cdr.markForCheck();
      },
      error: (err) => console.log('Error deleting User: ', err)
    });
  }

  getUserById(id: number): void {
    this.userservice.getUserById(id).subscribe({
      next: (res) => {
        console.log("User details fetched:", res);
        this.router.navigate(['/updateuser', id]);
      },
      error: (err) => console.log(err)
    });
  }


}
