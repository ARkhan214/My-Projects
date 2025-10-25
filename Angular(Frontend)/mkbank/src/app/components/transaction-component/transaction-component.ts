import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Transactionsservice } from '../../service/transactionsservice';
import { Transaction } from '../../model/transactions.model';
import { Accounts } from '../../model/accounts.model';

@Component({
  selector: 'app-transaction-component',
  standalone: false,
  templateUrl: './transaction-component.html',
  styleUrl: './transaction-component.css'
})
export class TransactionComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

// transactions: Transaction[] = [];
// acounts: Accounts[] =[];
// // transactions: any;

//   constructor(
//     private transactionService:Transactionsservice,
//     private cdr: ChangeDetectorRef
//   ){}

//   ngOnInit(): void {
//    this.loadTransactions();
//   }

//   loadTransactions(): void {
//     this.transactionService.getAllTransactions().subscribe({
//       next: (data) => {
//         this.transactions = data;
//         this.cdr.markForCheck();
//       },
//       error: (err) => {
//         console.error('Failed to load transactions:', err);
//       }
//     });
//   }


// deleteTransaction(id: string): void {
//   this.transactionService.deleteTransaction(id).subscribe({
//     next: () => {
//       console.log('Transaction deleted');
//       this.loadTransactions();
//       this.cdr.markForCheck();
//       // this.cdr.reattach();
//     },
//     error: (err) => {
//       console.log('Error deleting Transaction: ', err);
//     }
//   });
// }




//   deleteTransaction(id: string): void {
//   this.transactionService.deleteTransaction(id).subscribe({
//     next: () => {
//       this.transactions = this.transactions.filter(txn => txn.id !== id);
//       console.log('Transaction deleted successfully');
//       this.cdr.markForCheck();
//     },
//     error: (error) => {
//       console.error('Transaction delete error:', error);
//       alert('Failed to delete transaction. Please try again.');
//     }
//   });
// }


}
