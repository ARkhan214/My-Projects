import { ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Accountsservice } from '../../service/accountsservice';
import { DepositService } from '../../service/deposit-service';
import { error } from 'console';
import { Transactionsservice } from '../../service/transactionsservice';
import { Transaction } from '../../model/transactions.model';
import { TransactionType } from '../../model/transactionType.model';
import { EmployeeTransactionService } from '../../service/employee-transaction-service';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { AlertService } from '../../service/alert-service';



@Component({
  selector: 'app-deposit-component',
  standalone: false,
  templateUrl: './deposit-component.html',
  styleUrl: './deposit-component.css'
})
export class DepositComponent implements OnInit {
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
    private alertService:AlertService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // ngOnInit() {
  //   const storedAccountId = localStorage.getItem('accountId');
  //   if (storedAccountId) {
  //     this.accountId = Number(storedAccountId);
  //     this.senderId = Number(storedAccountId);  
  //   }
  // }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedAccountId = localStorage.getItem('accountId');
      if (storedAccountId) {
        this.accountId = Number(storedAccountId);
        this.senderId = Number(storedAccountId);
      }
    }
  }

  depositAndWithdraw() {
    if (!this.accountId || !this.transaction.amount || !this.transaction.type) {

      this.alertService.warning('Account ID, Amount, and Type are required!');
      return;
    }

    this.empTransactionService.depositAndWithdrawHandel(this.transaction as Transaction, this.accountId)
      .subscribe({
        next: (res) => {

          if (this.transaction.type === this.transactionType.WITHDRAW) {

            this.alertService.success(res.amount + ' Taka has been withdrawn.')
          } else if (this.transaction.type === this.transactionType.DEPOSIT) {

            this.alertService.success('Deposit Successful!');
          }
          this.cdr.markForCheck();
          this.resetForm();
        },
        error: (err) => {
          console.error(err);

          this.alertService.error('Transaction Failed!');
        }
      });
  }

  fake() { }

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
