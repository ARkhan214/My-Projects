import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BillPaymentService } from '../../service/bill-payment-service';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert-service';
import { Transaction } from '../../model/transactions.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-water-bill-component',
  standalone: false,
  templateUrl: './water-bill-component.html',
  styleUrl: './water-bill-component.css'
})
export class WaterBillComponent implements OnInit {

  waterBillForm!: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private billPaymentService: BillPaymentService,
    private alertService: AlertService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Browser-only token fetch
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken') || '';
    }

    // Reactive form setup
    this.waterBillForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      companyName: ['', Validators.required],
      accountHolderBillingId: ['', Validators.required]
    });

    // Load saved form data from localStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('waterBillForm');
      if (savedForm) {
        this.waterBillForm.patchValue(JSON.parse(savedForm));
      }

      // Auto-save form on changes
      this.waterBillForm.valueChanges.subscribe(val => {
        localStorage.setItem('waterBillForm', JSON.stringify(val));
      });
    }
  }

  // Submit handler
  onSubmit() {
    if (this.waterBillForm.invalid) {
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    const formValue = this.waterBillForm.value;

    // Build Transaction object
    const transaction: Transaction = {
      type: 'WATER' as any,   // backend যদি TransactionType enum expect করে
      amount: formValue.amount,
      companyName: formValue.companyName,
      accountHolderBillingId: formValue.accountHolderBillingId,
      transactionTime: new Date(),
      accountId: 0 // backend token থেকে নিবে
    };

    this.billPaymentService.payWater(transaction, this.token).subscribe({
      next: res => {
        this.alertService.success(`${res.amount} Taka Payment successful!`);
        this.resetForm();
        this.router.navigate(['/invoice']);
      },
      error: err => {
        this.alertService.error(err.error?.message || 'Payment failed!');
      }
    });
  }

  // Reset form + clear localStorage
  resetForm() {
    this.waterBillForm.reset({
      amount: 0,
      companyName: '',
      accountHolderBillingId: ''
    });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('waterBillForm');
    }
  }
}