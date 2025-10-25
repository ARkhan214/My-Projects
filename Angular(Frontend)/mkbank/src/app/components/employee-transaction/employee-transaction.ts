import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EmployeeTransactionService } from '../../service/employee-transaction-service';
import { Transaction } from '../../model/transactions.model';
import { TransactionType } from '../../model/transactionType.model';
import { isPlatformBrowser } from '@angular/common';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-employee-transaction',
  standalone: false,
  templateUrl: './employee-transaction.html',
  styleUrl: './employee-transaction.css'
})
export class EmployeeTransaction implements OnInit {

  transactionType = TransactionType;

  transaction: Partial<Transaction> = {
    amount: 0,
    description: ''

  };

  accountId: number = 0;      // Deposit
  senderId: number = 0;       // Transfer
  receiverId: number = 0;     // Transfer

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private empTransactionService: EmployeeTransactionService,
    private cdr: ChangeDetectorRef,
    private alertService:AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedAccountId = localStorage.getItem('accountId');
      if (storedAccountId) {
        this.accountId = Number(storedAccountId);
        this.senderId = Number(storedAccountId);
      }
    }
    this.transaction.type=this.transactionType.TRANSFER;
  }

  transfer() {
    if (!this.senderId || !this.receiverId || !this.transaction.amount || !this.transaction.type) {
      this.errorMessage = 'Sender, Receiver, Amount, and Type are required!';
      return;
    }

    this.empTransactionService.transfer(this.transaction as Transaction, this.senderId, this.receiverId)
      .subscribe({
        next: (res) => {
          // alert('Transaction Successful!');
          this.alertService.success('Transaction Successful!');
          this.cdr.markForCheck();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
          // alert(err.error?.message || 'Transaction Failed!');
          this.alertService.error('Transaction Failed!');
          this.successMessage = '';
        }
      });
  }

  fake(){}

  resetForm() {
    this.accountId = 0;
    this.senderId = 0;
    this.receiverId = 0;
    this.transaction = {
      amount: 0,
      description: '',
      type: undefined
    };
    this.successMessage = '';
    this.errorMessage = '';
  }

}
