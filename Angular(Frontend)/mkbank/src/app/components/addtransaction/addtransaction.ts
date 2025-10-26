import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transactionsservice } from '../../service/transactionsservice';
import { Transaction } from '../../model/transactions.model';
import { TransactionType } from '../../model/transactionType.model';
import { isPlatformBrowser } from '@angular/common';
import { AlertService } from '../../service/alert-service';
import { Accounts } from '../../model/accounts.model';
import { Accountsservice } from '../../service/accountsservice';

@Component({
  selector: 'app-addtransaction',
  standalone: false,
  templateUrl: './addtransaction.html',
  styleUrl: './addtransaction.css'
})
export class Addtransaction implements OnInit {

  transactionForm!: FormGroup;
  transactionType = TransactionType;
  token: string = '';
  receiverAccount?: Accounts;
  loadingReceiver: boolean = false;
  loading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private transactionService: Transactionsservice,
    private accountService: Accountsservice, //Correct Service injected
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    //Browser-only token fetch
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('authToken') || '';
    }

    //Reactive form setup
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      description: [''],
      receiverId: ['']
    });

    //Load saved form data
    if (isPlatformBrowser(this.platformId)) {
      const savedForm = localStorage.getItem('transactionForm');
      if (savedForm) {
        this.transactionForm.patchValue(JSON.parse(savedForm));
      }

      // Auto-save on changes
      this.transactionForm.valueChanges.subscribe(val => {
        localStorage.setItem('transactionForm', JSON.stringify(val));
      });
    }

    //Receiver ID change হলে অটো-লোড
    this.transactionForm.get('receiverId')?.valueChanges.subscribe(id => {
      if (id) {
        this.loadReceiverData(id);
        this.cdRef.detectChanges();
      } else {
        this.receiverAccount = undefined;
      }
    });
  }



  //Receiver Data Load (Service Call)
  loadReceiverData(receiverId: number) {
    this.loadingReceiver = true;
    this.accountService.getAccountById(receiverId).subscribe({
      next: (account) => {
        this.receiverAccount = account;
        this.loadingReceiver = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Receiver load failed:', err);
        this.alertService.error(err.error?.message || 'Receiver not found!');
        this.receiverAccount = undefined;
        this.loadingReceiver = false;
      }
    });
  }

  //Submit handler
  onSubmit() {
    if (this.transactionForm.invalid) {
      this.alertService.warning('Form is invalid! Please fill all required fields.');
      return;
    }

    this.loading = true; //for loading

    const formValue = this.transactionForm.value;

    const transaction: Transaction = {
      type: formValue.type,
      amount: formValue.amount,
      description: formValue.description,
      transactionTime: new Date(),
      accountId: 0 // backend will handle accountId from token
    };

    // === Transfer ===
    if (formValue.type === this.transactionType.TRANSFER) {
      if (!formValue.receiverId) {
        this.alertService.warning('Receiver Account ID is required for Transfer!');
        this.loading = false;  //for loading
        return;
      }
      transaction.receiverAccountId = formValue.receiverId;

      this.transactionService.transfer(transaction, formValue.receiverId).subscribe({
        next: res => {
          this.alertService.success('Transfer Successful!');
          this.resetForm();
          this.loading = false; // ✅ লোডিং বন্ধ
        },
        error: err => {
          console.error('Transfer failed:', err);
          this.alertService.error(err.error?.message || 'Transfer Failed!');
          this.loading = false; // ✅ লোডিং বন্ধ
        }
      });

    } else {
      // Deposit / Withdraw
      this.transactionService.makeTransaction(transaction).subscribe({
        next: res => {
          this.alertService.success('Transaction Successful!');
          this.resetForm();
          this.loading = false; // ✅ লোডিং বন্ধ
        },
        error: err => {
          console.error('Transaction failed:', err);
          this.alertService.error(err.error?.message || 'Transaction Failed!');
          this.loading = false; // ✅ লোডিং বন্ধ
        }
      });
    }
  }

  //Reset form
  resetForm() {
    this.transactionForm.reset({
      type: '',
      amount: 0,
      description: '',
      receiverId: ''
    });
    this.receiverAccount = undefined;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('transactionForm');
    }
  }

}
