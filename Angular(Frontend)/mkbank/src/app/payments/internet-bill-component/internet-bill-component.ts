import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillPaymentService } from '../../service/bill-payment-service';
import { AlertService } from '../../service/alert-service';
import { isPlatformBrowser } from '@angular/common';
import { Transaction } from '../../model/transactions.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internet-bill-component',
  standalone: false,
  templateUrl: './internet-bill-component.html',
  styleUrl: './internet-bill-component.css'
})
export class InternetBillComponent {

  internetBillForm!: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private billPaymentService: BillPaymentService,
    private alertService: AlertService,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken') || '';
    }

    this.internetBillForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      companyName: ['', Validators.required],
      accountHolderBillingId: ['', Validators.required]
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('internetBillForm');
      if (savedForm) this.internetBillForm.patchValue(JSON.parse(savedForm));
      this.internetBillForm.valueChanges.subscribe(val => {
        localStorage.setItem('internetBillForm', JSON.stringify(val));
      });
    }
  }

  onSubmit() {
    if (this.internetBillForm.invalid) {
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    const formValue = this.internetBillForm.value;
    const transaction: Transaction = {
      type: 'INTERNET' as any,
      amount: formValue.amount,
      companyName: formValue.companyName,
      accountHolderBillingId: formValue.accountHolderBillingId,
      transactionTime: new Date(),
      accountId: 0
    };

    this.billPaymentService.payInternet(transaction, this.token).subscribe({
      next: res => {
        this.alertService.success(`${res.amount} Taka Internet Bill Payment successful!`);
        this.resetForm();
      this.router.navigate(['/invoice']);
      },
      error: err => { this.alertService.error(err.error?.message || 'Payment failed!'); }
    });
  }

  resetForm() {
    this.internetBillForm.reset({ amount: 0, companyName: '', accountHolderBillingId: '' });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('internetBillForm');
    }
  }

}
