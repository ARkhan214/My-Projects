import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillPaymentService } from '../../service/bill-payment-service';
import { AlertService } from '../../service/alert-service';
import { isPlatformBrowser } from '@angular/common';
import { Transaction } from '../../model/transactions.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-bill-component',
  standalone: false,
  templateUrl: './mobile-bill-component.html',
  styleUrl: './mobile-bill-component.css'
})
export class MobileBillComponent {


  mobileBillForm!: FormGroup;
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

    this.mobileBillForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      companyName: ['', Validators.required],
      accountHolderBillingId: ['', Validators.required]
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('mobileBillForm');
      if (savedForm) this.mobileBillForm.patchValue(JSON.parse(savedForm));
      this.mobileBillForm.valueChanges.subscribe(val => {
        localStorage.setItem('mobileBillForm', JSON.stringify(val));
      });
    }
  }

  onSubmit() {
    if (this.mobileBillForm.invalid) {
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    const formValue = this.mobileBillForm.value;
    const transaction: Transaction = {
      type: 'MOBILE' as any,
      amount: formValue.amount,
      companyName: formValue.companyName,
      accountHolderBillingId: formValue.accountHolderBillingId,
      transactionTime: new Date(),
      accountId: 0
    };

    this.billPaymentService.payMobile(transaction, this.token).subscribe({
      next: res => {
        this.alertService.success(`${res.amount} Taka Mobile Recharge successful!`);
        this.resetForm();
        this.router.navigate(['/invoice']);
      },
      error: err => { this.alertService.error(err.error?.message || 'Payment failed!'); }
    });
  }

  resetForm() {
    this.mobileBillForm.reset({ amount: 0, companyName: '', accountHolderBillingId: '' });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('mobileBillForm');
    }
  }

}
