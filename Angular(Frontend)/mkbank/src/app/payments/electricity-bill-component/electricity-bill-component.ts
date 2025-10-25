import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillPaymentService } from '../../service/bill-payment-service';
import { AlertService } from '../../service/alert-service';
import { isPlatformBrowser } from '@angular/common';
import { Transaction } from '../../model/transactions.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-electricity-bill-component',
  standalone: false,
  templateUrl: './electricity-bill-component.html',
  styleUrl: './electricity-bill-component.css'
})
export class ElectricityBillComponent implements OnInit {


  electricityBillForm!: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private billPaymentService: BillPaymentService,
    private alertService: AlertService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Browser-only token fetch
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken') || '';
    }

    // Reactive form setup
    this.electricityBillForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      companyName: ['', Validators.required],
      accountHolderBillingId: ['', Validators.required]
    });

    // Load saved form data from localStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('electricityBillForm');
      if (savedForm) {
        this.electricityBillForm.patchValue(JSON.parse(savedForm));
      }

      // Auto-save form on changes
      this.electricityBillForm.valueChanges.subscribe(val => {
        localStorage.setItem('electricityBillForm', JSON.stringify(val));
      });
    }
  }

  // Submit handler
  onSubmit() {
    if (this.electricityBillForm.invalid) {
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    const formValue = this.electricityBillForm.value;

    // Build Transaction object
    const transaction: Transaction = {
      type: 'ELECTRICITY' as any, // backend যদি TransactionType enum expect করে
      amount: formValue.amount,
      companyName: formValue.companyName,
      accountHolderBillingId: formValue.accountHolderBillingId,
      transactionTime: new Date(),
      accountId: 0 // backend token থেকে নিবে
    };

    this.billPaymentService.payElectricity(transaction, this.token).subscribe({
      next: res => {
        this.alertService.success(`${res.amount} Taka Electricity Bill Payment successful!`);
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
    this.electricityBillForm.reset({
      amount: 0,
      companyName: '',
      accountHolderBillingId: ''
    });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('electricityBillForm');
    }
  }

}
