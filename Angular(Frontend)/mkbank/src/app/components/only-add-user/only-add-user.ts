import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { Role } from '../../model/role.model';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-only-add-user',
  standalone: false,
  templateUrl: './only-add-user.html',
  styleUrl: './only-add-user.css'
})
export class OnlyAddUser implements OnInit{

  userAccountForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private alertService:AlertService,
     private router: Router
  ){}


  ngOnInit(): void {
this.userAccountForm = this.formbuilder.group({
      // User fields
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      // role: ['', Validators.required],
      photo: ['']
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


 onSubmit(){
   if (this.userAccountForm.valid) {
        const formValues = this.userAccountForm.value;
  
        const userObj: User = {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          phoneNumber: formValues.phoneNumber,
          dateOfBirth: formValues.dateOfBirth,
          role:Role.ADMIN,
          photo: formValues.photo
        };

  
        const formData = new FormData();
        formData.append('user', JSON.stringify(userObj));
        if (this.selectedFile) {
          formData.append('photo', this.selectedFile, this.selectedFile.name);
        }
  
        this.userService.registerUser(formData).subscribe({
          next: () => {
            // alert('Admin Saved Successfully!');
            this.alertService.success('Admin Saved Successfully!');
            this.userAccountForm.reset();
            this.selectedFile = null;
          },
          error: (err) => {
            console.error(err);
            // alert('Failed to Save Admin.');
            this.alertService.error('Failed to Save Admin.');
          }
        });
      }
 }


}
