import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Transaction } from '../../model/transactions.model';
import { Transactionsservice } from '../../service/transactionsservice';
import { ActivatedRoute } from '@angular/router';

declare var html2pdf: any;

@Component({
  selector: 'app-transaction-statement',
  standalone: false,
  templateUrl: './transaction-statement.html',
  styleUrl: './transaction-statement.css'
})
export class TransactionStatement implements OnInit {

  transactionsWithBalance: (Transaction & { balance: number })[] = [];
  accountId !: number;
  transactions: Transaction[] = [];
  errorMessage: string = '';
  loading = false;
  today: Date = new Date();
  isLoggedInUser: boolean = false;

  // new Fild for Date
  startDate!: Date;
  endDate!: Date;

  constructor(
    private transactionService: Transactionsservice,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accountIdFromUrl = params['accountId'];
      if (accountIdFromUrl) {
        this.accountId = accountIdFromUrl;
        this.isLoggedInUser = true;
        this.findStatement();   //  Auto load on route param
      } else {
        this.errorMessage = 'No account ID found in URL.';
      }
    });
  }

  printStatement(): void {
    const element = document.getElementById('statementTable');
    const opt = {
      margin: 0.5,
      filename: `account-statement-${this.accountId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    if (element) {
      html2pdf().set(opt).from(element).save();
    } else {
      alert('Nothing to print!');
    }
  }

  findStatement(): void {
    if (!this.accountId) {
      this.errorMessage = 'Please enter an Account ID.';
      this.transactions = [];
      this.transactionsWithBalance = [];
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.transactions = [];
    this.transactionsWithBalance = [];

    this.transactionService.getTransactionsByAccountId(this.accountId).subscribe({
      next: (result) => {
        this.loading = false;

        // if user select date
        if (this.startDate && this.endDate) {
          const start = new Date(this.startDate);
          const end = new Date(this.endDate);

          result = result.filter(t => {
            const tDate = new Date(t.transactionTime);
            return tDate >= start && tDate <= end;
          });
        }

        if (result.length === 0) {
          this.errorMessage = 'No transactions found for this Account ID.';
        } else {
          result.sort((a, b) => new Date(a.transactionTime).getTime() - new Date(b.transactionTime).getTime());

          let balance = 0;
          this.transactionsWithBalance = result.map(t => {

            if (t.type === 'DEPOSIT' || t.type === 'RECEIVE') {
              balance += t.amount;
              console.log(t.amount);
            } else if (t.type === 'WITHDRAW' || t.type === 'TRANSFER') {
              balance -= t.amount;
            }
            

            return { ...t, balance };
          });

          this.transactions = result;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Error fetching statement.';
      }
    });
  }
}
