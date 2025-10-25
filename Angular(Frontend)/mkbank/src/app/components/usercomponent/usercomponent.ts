import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../model/user.model';
import { Accounts } from '../../model/accounts.model';
import { Accountsservice } from '../../service/accountsservice';
import { Transactionsservice } from '../../service/transactionsservice';
import { Role } from '../../model/role.model';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-usercomponent',
  standalone: false,
  templateUrl: './usercomponent.html',
  styleUrl: './usercomponent.css'
})
export class Usercomponent implements OnInit {

  userAccountForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private accountService: Accountsservice,
    private formbuilder: FormBuilder,
    private transactionService: Transactionsservice,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userAccountForm = this.formbuilder.group({
      // User fields
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      role: [''],
      photo: [''],

      // Account fields
      accountType: ['', Validators.required],
      balance: ['', Validators.required],
      accountActiveStatus: [true, Validators.required],
      nid: ['', Validators.required],
      address: ['', Validators.required],
      accountOpeningDate: ['', Validators.required],
      accountClosingDate: ['']
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.userAccountForm.valid) {
      const formValues = this.userAccountForm.value;

      const userObj: User = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        phoneNumber: formValues.phoneNumber,
        dateOfBirth: formValues.dateOfBirth,
        role: Role.USER,
        photo: formValues.photo
      };

      const accountObj: Accounts = {
        accountType: formValues.accountType,
        balance: Number(formValues.balance),
        name: formValues.name,
        accountActiveStatus: formValues.accountActiveStatus,
        photo: formValues.photo,
        nid: formValues.nid,
        phoneNumber: formValues.phoneNumber,
        address: formValues.address,
        dateOfBirth: formValues.dateOfBirth,
        accountOpeningDate: formValues.accountOpeningDate,
        accountClosingDate: formValues.accountClosingDate,
        role: Role.USER
      };

      const formData = new FormData();
      formData.append('user', JSON.stringify(userObj));
      formData.append('account', JSON.stringify(accountObj));
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
      }

      this.accountService.registerAccount(formData).subscribe({
        next: () => {
          // alert('User and Account saved successfully!');
          this.alertService.success('User and Account saved successfully!');
          this.userAccountForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error(err);
          // alert('Failed to save user and account.');
          this.alertService.error('Failed to save user and account.');
        }
      });
    }
    
    else {
      this.alertService.error('Please fill all required fields!');
    }

  }



  loadUserWithAccounts(userId: number) {
    this.userService.getUserById(userId).subscribe(user => {
      this.accountService.getAccountsByUserId(userId).subscribe(accounts => {
        console.log('User:', user);
        console.log('Accounts:', accounts);
      });
    });
  }

}
