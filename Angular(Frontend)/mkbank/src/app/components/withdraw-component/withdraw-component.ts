import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WithdrawService } from '../../service/withdraw.service';
import { Accountsservice } from '../../service/accountsservice';
import { Withdraw } from '../../model/withdraw.model';
import { Transactionsservice } from '../../service/transactionsservice';
import { Transaction } from '../../model/transactions.model';
import { TransactionType } from '../../model/transactionType.model';
import { isPlatformBrowser } from '@angular/common';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-withdraw-component',
  standalone: false,
  templateUrl: './withdraw-component.html',
  styleUrl: './withdraw-component.css'
})
export class WithdrawComponent implements OnInit {


  formGroup !: FormGroup;
  transactionType = TransactionType;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: Transactionsservice,
    private alertService:AlertService,
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Browser-only token fetch
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken') || '';
    }

    // Reactive form setup
    this.formGroup = this.fb.group({
      type: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    // Load saved form data from localStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('transactionForm');
      if (savedForm) {
        this.formGroup.patchValue(JSON.parse(savedForm));
      }

      // Auto-save form on changes
      this.formGroup.valueChanges.subscribe(val => {
        localStorage.setItem('transactionForm', JSON.stringify(val));
      });
    }
  }

  // Submit handler
  onSubmit() {
    if (this.formGroup.invalid) {
      // alert('Form is invalid! Please fill all required fields.');
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    const formValue = this.formGroup.value;

    // Build transaction object
    const transaction: Transaction = {
      type: formValue.type,
      amount: formValue.amount,
      description: formValue.description,
      transactionTime: new Date(),
      accountId: 0 // backend will handle accountId from token
    };
    
      // Only For Withdraw
      
    if(formValue.type === this.transactionType.WITHDRAW) {
    
      this.transactionService.makeTransaction(transaction).subscribe({
        next: res => {
          // alert('Withdraw Successful!');
          this.alertService.success(res.amount+' Taka Withdraw Successful!');
          this.resetForm();
        },
        error: err => {
          console.error('Withdraw failed:', err);
          // alert(err.error?.message || 'Withdraw Failed!');
          this.alertService.error(err.error?.message || 'Withdraw Failed!');
        }
      });
    }
  }

  // Reset form + clear localStorage
  resetForm() {
    this.formGroup.reset({
      type: '',
      amount: 0,
      description: ''
    });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('transactionForm');
    }
  }



}
