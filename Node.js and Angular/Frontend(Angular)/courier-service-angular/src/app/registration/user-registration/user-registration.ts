import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // ✅ HttpClientModule
import { UserService } from '../../services/user-service';


@Component({
  selector: 'app-user-registration',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css'
})
export class UserRegistration {
name = '';
  email = '';
  password = '';
  phone = '';
  photo: File | null = null;
  loading = false; // loading flag added

  constructor(private userService: UserService) { }

  onFileSelected(event: any) {
    this.photo = event.target.files[0];
  }

  saveUser() {
    if (!this.name || !this.email || !this.password) {
      alert('Please fill all required fields!');
      return;
    }

    this.loading = true; // start loading
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('phone', this.phone);
    if (this.photo) formData.append('photo', this.photo);

    this.userService.saveUser(formData).subscribe({
      next: (res) => {
        alert('User registered successfully!');
        this.resetForm();
        this.loading = false; // stop loading
      },
      error: (err) => {
        console.error(err);
        alert('Failed to register user!');
        this.loading = false; // stop loading
      }
    });
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.phone = '';
    this.photo = null;
  }
}
