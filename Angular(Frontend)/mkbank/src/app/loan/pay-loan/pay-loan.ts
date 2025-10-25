import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { LoanService } from '../../service/loan-service';
import { AlertService } from '../../service/alert-service';
import { LoanPayService } from '../../service/loan-pay-service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pay-loan',
  standalone: false,
  templateUrl: './pay-loan.html',
  styleUrl: './pay-loan.css'
})
export class PayLoan {
  //---------------------Second part start (etate Id Dropdown a load hoy)--------

  allLoans: any[] = [];          // users all loan
  selectedLoanId: number | null = null; // select from dropdown 
  loanData: any = null;           // details selected loan
  amount: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private loanPayService: LoanPayService,
    private alertService: AlertService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserLoans();
    }
  }

  private getAuthToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  // load users all loan
  loadUserLoans(): void {
    const token = this.getAuthToken();
    if (!token) return;

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:8085/api/loans/myloans', { headers })
      .subscribe({
        next: (res) => {
          this.allLoans = res;
          if (this.allLoans.length > 0) {
            this.selectedLoanId = this.allLoans[0].id;
            this.fetchLoanDetails();
          }
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to load loans');
        }
      });
  }

  // load selected loan
  fetchLoanDetails(): void {
    if (!this.selectedLoanId) return;

    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get(`http://localhost:8085/api/loans/${this.selectedLoanId}`, { headers })
      .subscribe({
        next: (res: any) => {
          this.loanData = res;
          this.errorMessage = '';
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = err.error || 'Loan not found';
          this.loanData = null;
        }
      });
  }

  // payment function
  payLoan(): void {
    if (!this.selectedLoanId || !this.amount) {
      this.alertService.error('Please enter amount');
      return;
    }

    this.loading = true;
    this.loanPayService.payLoan(this.selectedLoanId, this.amount).subscribe({
      next: (res) => {
        this.alertService.success('Payment successful! ' + this.amount);
        this.errorMessage = '';
        this.resetForm();
        this.router.navigate(['/invoice']);
        this.loading = false;
        this.fetchLoanDetails(); // refresh loan info
      },
      error: (err) => {
        this.alertService.error(err.error || 'Payment failed');
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.selectedLoanId = null;
    this.loanData = null;
    this.amount = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = false;
  }

  //---------------------First part start(eta diea loan id dite hoy)--------

  //  loanId: number | null = null;
  //   amount: number | null = null;
  //   loanData: any = null;
  //   successMessage: string = '';
  //   errorMessage: string = '';
  //   loading: boolean = false;

  //   constructor(
  //     private loanPayService: LoanPayService,
  //     private alertService: AlertService,
  //     private router: Router,
  //     private http: HttpClient,
  //     private cdr: ChangeDetectorRef,
  //     @Inject(PLATFORM_ID) private platformId: Object
  //   ) { }

  //   ngOnInit(): void {
  //     if (isPlatformBrowser(this.platformId)) {
  //       const savedLoanId = localStorage.getItem('loanId');
  //       if (savedLoanId) {
  //         this.loanId = Number(savedLoanId);
  //         this.fetchLoanDetails(); // auto-fetch saved loan
  //       }
  //     }
  //   }

  //   private getAuthToken(): string {
  //     if (isPlatformBrowser(this.platformId)) {
  //       return localStorage.getItem('authToken') || '';
  //     }
  //     return '';
  //   }

  //  // Fetch loan details
  //  fetchLoanDetails(): void {
  //   if (!this.loanId) {
  //     this.errorMessage = 'Please enter Loan ID';
  //     this.loanData = null;
  //     return;
  //   }

  //   const token = this.getAuthToken();
  //   if (!token) {
  //     this.alertService.error('Authentication token not found. Please login again.');
  //     return;
  //   }

  //   const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  //   this.http.get(`http://localhost:8085/api/loans/${this.loanId}`, { headers })
  //     .subscribe({
  //       next: (res: any) => {
  //         this.loanData = res;
  //         console.log('Data----------------'+res);
  //         this.errorMessage = '';
  //         this.cdr.markForCheck();
  //       },
  //       error: (err: any) => {
  //         console.error(err);
  //         this.errorMessage = err.error || 'Loan not found';
  //         this.loanData = null;
  //       }
  //     });
  // }


  //   //  loan payment
  //   payLoan(): void {
  //     if (!this.loanId || !this.amount) {
  //        this.alertService.error('Please enter amount');
  //       return;
  //     }

  //     this.loading = true;
  //     this.loanPayService.payLoan(this.loanId, this.amount).subscribe({
  //   next: (res) => {
  //     this.alertService.success('Payment successful! '+this.amount);
  //     this.errorMessage = '';
  //     this.loading = false;
  //     this.fetchLoanDetails(); // refresh loan info
  //   },
  //   error: (err) => {
  //     this.alertService.error(err.error || 'Payment failed');
  //     this.successMessage = '';
  //     this.loading = false;
  //   }
  // });
  //   }

}
