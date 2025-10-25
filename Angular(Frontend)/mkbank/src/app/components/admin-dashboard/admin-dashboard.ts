import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Accountsservice } from '../../service/accountsservice';
import { Transactionsservice } from '../../service/transactionsservice';
import { Accounts } from '../../model/accounts.model';
import { Transaction } from '../../model/transactions.model';
import { UserService } from '../../service/user.service';
import { EmployeeService } from '../../service/employee-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  totalAccounts: number = 0;
  totalEmployee: number = 0;

  totalDeposit: number = 0;
  totalDebit: number = 0;

  currentCash: number = 0;

  totalLoan!: number;

  totalUsers: number = 0;
  totalSalary: number = 0;


  constructor(
    private accountService: Accountsservice,
    private userService: UserService,
    private transactionService: Transactionsservice,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) { }



  ngOnInit(): void {
    //  Total Accounts(its working)
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.cdr.markForCheck();
      }
    });

    //  Total Users(its working)
    this.userService.getAllUsers().subscribe({
      next: (user) => {
        this.totalUsers = user.length;
        this.cdr.markForCheck();
      }
    });

    this.employeeService.getAllAccount().subscribe({
      next: (employee) => {
        this.totalEmployee = employee.length;
        this.cdr.markForCheck();
      }
    })



    this.employeeService.getTotalSalary().subscribe({
      next: (salary) => {
        this.totalSalary = salary;
        console.log("Total Salary: ", this.totalSalary);
        this.cdr.markForCheck();
      }
    })


    //  Total Deposit (positive)(its working)
this.transactionService.getPositiveTransactions().subscribe({
  next: (data) => {
    // Response er totalCredit, totalDebit directly use korte parba
    this.totalDeposit = data.totalCredit;
    this.totalDebit = data.totalDebit;

    this.currentCash = this.totalDeposit - this.totalDebit - this.totalSalary;

    this.cdr.markForCheck();
  },
  error: (err) => {
    console.error('Error fetching totals:', err);
  }
});


    //  Total Withdraw (negative)
    this.transactionService.getWithdrawTransactions().subscribe({
      next: (transactions) => {
        console.log('Withdraw Transactions:', transactions);
        this.totalDebit = transactions
          .map(t => t.amount) // positive value
          .reduce((acc, curr) => acc + curr, 0);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Withdraw fetch failed:', err);
      }
    });




    //for All loan Sum
  this.transactionService.getAllLoanAmount().subscribe({
  next: (loanAmount) => {
    this.totalLoan =  loanAmount.totalLoan;  //  property ধরতে হবে
    this.cdr.markForCheck();
    console.log('LoanAmount--:', this.totalLoan);
  },
  error: (err) => {
    console.error('LoanAmount fetch failed:', err);
  }
});
  }


}
