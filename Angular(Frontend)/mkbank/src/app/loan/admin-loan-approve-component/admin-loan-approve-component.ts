import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoanService } from '../../service/loan-service';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-admin-loan-approve-component',
  standalone: false,
  templateUrl: './admin-loan-approve-component.html',
  styleUrl: './admin-loan-approve-component.css'
})
export class AdminLoanApproveComponent implements OnInit {
  loans: any[] = [];

  massage!: '';

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
        this.loans = data.filter((loan: any) => loan.status === 'PENDING');
        this.cdr.markForCheck();
        console.log(data, "fgjytjkyu");
      },
      error: (err) => console.error('Error fetching loans', err)
    });
  }

  // approveLoan(loanId: number) {
  //   this.loanService.approveLoan(loanId).subscribe({
  //     next: (res) => {        
  //       // alert('Loan Approved Successfully');
  //        this.cdr.markForCheck();
  //       this.loadPendingLoans(); 

  //       // this.alertService.success('Loan Approved Successfully');
  //       // refresh pending loans
  //     },
  //     error: (err) => console.error('Error approving loan', err)
  //   });
  // }

  approveLoan(loanId: number) {
    this.loanService.approveLoan(loanId).subscribe({
      next: () => {
        alert(' Loan Approved Successfully');
        this.cdr.markForCheck();
        this.loadPendingLoans();
      },
      error: (err) => {
        console.error('Error approving loan', err);

        // If backend did the work but returned an error response
        if (err.status === 200 || err.status === 201) {
          alert(' Loan Approved Successfully');
          this.loadPendingLoans();
        } else {
          alert(' Failed to approve loan. Please try again.');
        }
      }
    });
  }




rejectLoan(loanId: number) {
  this.loanService.rejectLoan(loanId).subscribe({
    next: () => {
      this.alertService.success('Loan not Approved ');
      this.loadPendingLoans(); // refresh pending loans
    },
    error: (err) => {
      console.error('Error rejecting loan', err)

      if (err.status === 200 || err.status === 201) {
          alert(' Loan Rejected Successfully');
          this.loadPendingLoans();
        } else {
          alert(' Failed to reject loan. Please try again.');
        }
    }
  });
}

}
