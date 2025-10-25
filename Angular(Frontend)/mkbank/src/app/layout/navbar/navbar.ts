import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

   userType: string = '';

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.userType = user?.role || '';
    });
  }



}
