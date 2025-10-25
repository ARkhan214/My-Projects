import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillPaymentService } from '../../service/bill-payment-service';
import { AlertService } from '../../service/alert-service';
import { isPlatformBrowser } from '@angular/common';
import { Transaction } from '../../model/transactions.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-card-bill-component',
  standalone: false,
  templateUrl: './credit-card-bill-component.html',
  styleUrl: './credit-card-bill-component.css'
})
export class CreditCardBillComponent {

  creditCardBillForm!: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private billPaymentService: BillPaymentService,
    private alertService: AlertService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken') || '';
    }

    this.creditCardBillForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      companyName: ['', Validators.required],
      accountHolderBillingId: ['', Validators.required]
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('creditCardBillForm');
      if (savedForm) this.creditCardBillForm.patchValue(JSON.parse(savedForm));
      this.creditCardBillForm.valueChanges.subscribe(val => {
        localStorage.setItem('creditCardBillForm', JSON.stringify(val));
      });
    }
  }

  onSubmit() {
    if (this.creditCardBillForm.invalid) {
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    const formValue = this.creditCardBillForm.value;
    const transaction: Transaction = {
      type: 'CREDIT_CARD' as any,
      amount: formValue.amount,
      companyName: formValue.companyName,
      accountHolderBillingId: formValue.accountHolderBillingId,
      transactionTime: new Date(),
      accountId: 0
    };

    this.billPaymentService.payCreditCard(transaction, this.token).subscribe({
      next: res => {
        this.alertService.success(`${res.amount} Taka Credit Card Bill Paymeny successful!`);
        this.resetForm();
        this.router.navigate(['/invoice']);
      },
      error: err => { this.alertService.error(err.error?.message || 'Payment failed!'); }
    });
  }

  resetForm() {
    this.creditCardBillForm.reset({ amount: 0, companyName: '', accountHolderBillingId: '' });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('creditCardBillForm');
    }
  }

}
