import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Transaction } from '../../model/transactions.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillPaymentService } from '../../service/bill-payment-service';
import { AlertService } from '../../service/alert-service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gas-bill-component',
  standalone: false,
  templateUrl: './gas-bill-component.html',
  styleUrl: './gas-bill-component.css'
})
export class GasBillComponent {

  gasBillForm!: FormGroup;
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

    this.gasBillForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      companyName: ['', Validators.required],
      accountHolderBillingId: ['', Validators.required]
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('gasBillForm');
      if (savedForm) {
        this.gasBillForm.patchValue(JSON.parse(savedForm));
      }
      this.gasBillForm.valueChanges.subscribe(val => {
        localStorage.setItem('gasBillForm', JSON.stringify(val));
      });
    }
  }

  onSubmit() {
    if (this.gasBillForm.invalid) {
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    const formValue = this.gasBillForm.value;
    const transaction: Transaction = {
      type: 'GAS' as any,
      amount: formValue.amount,
      companyName: formValue.companyName,
      accountHolderBillingId: formValue.accountHolderBillingId,
      transactionTime: new Date(),
      accountId: 0
    };

    this.billPaymentService.payGas(transaction, this.token).subscribe({
      next: res => {
        this.alertService.success(`${res.amount} Taka GAS Bill Payment successful!`);
        this.resetForm();
        this.router.navigate(['/invoice']);
      },
      error: err => {
        this.alertService.error(err.error?.message || 'Payment failed!');
      }
    });
  }

  resetForm() {
    this.gasBillForm.reset({ amount: 0, companyName: '', accountHolderBillingId: '' });
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('gasBillForm');
    }
  }

}
