import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoanService } from '../../service/loan-service';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-view-all-loan-for-admin',
  standalone: false,
  templateUrl: './view-all-loan-for-admin.html',
  styleUrl: './view-all-loan-for-admin.css'
})
export class ViewAllLoanForAdmin implements OnInit {

  loans: any[] = [];
  filteredLoan: any[] = [];

  massage!: '';


  //For Search----Start
  searchById: string = '';
  searchByAccountId: string = '';
  searchByLoanType: string = '';
  searchByLoanAmount: string = '';
  //For Search----End


  constructor(

    private loanService: LoanService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPendingLoans();
  }

  loadPendingLoans() {
    this.loanService.getAll().subscribe({
      next: (data) => {
        this.loans = data;
this.filteredLoan=[...this.loans]
        this.cdr.markForCheck();
        console.log(data, "fgjytjkyu");
      },
      error: (err) => console.error('Error fetching loans', err)
    });
  }


  filterById(): void {
    if (!this.searchById) {
      this.filteredLoan = [...this.loans];
    } else {
      const search = this.searchById.toLowerCase();
      this.filteredLoan = this.loans.filter(l =>
        l.id?.toString() === search
      );
    }
    this.cdr.markForCheck();
  }

  filterByAccountId(): void {
    if (!this.searchByAccountId) {
      this.filteredLoan = [...this.loans];
    } else {
      const search = this.searchByAccountId.toLowerCase();
      this.filteredLoan = this.loans.filter(l =>
        l.account.id?.toString() === search
      );
    }
    this.cdr.markForCheck();
  }

  filterByLoanType(): void {
    if (!this.searchByLoanType) {
      this.filteredLoan = [...this.loans];
    } else {
      const search = this.searchByLoanType.toLowerCase();
      this.filteredLoan = this.loans.filter(l =>
        l.loanType?.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }

 filterByLoanAmount(): void {
    if (!this.searchByLoanAmount) {
      this.filteredLoan = [...this.loans];
    } else {
      const search = this.searchByLoanAmount.toLowerCase();
      this.filteredLoan = this.loans.filter(l =>
        l.loanAmount?.toString() === search
      );
    }
    this.cdr.markForCheck();
  }



}
