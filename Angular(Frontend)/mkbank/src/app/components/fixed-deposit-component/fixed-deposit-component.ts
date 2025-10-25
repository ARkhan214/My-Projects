import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AlertService } from '../../service/alert-service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-fixed-deposit-component',
  standalone: false,
  templateUrl: './fixed-deposit-component.html',
  styleUrl: './fixed-deposit-component.css'
})
export class FixedDepositComponent implements OnInit{

  
  depositAmount!: number;
  durationInMonths!: number;

   // Dropdown months list
  monthsList: number[] = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

  // Pre-filled data
  accountId!: number;
  accountName: string = '';
  balance!: number;
  accountType: string = '';
  nid: string = '';
  phoneNumber: string = '';
  address: string = '';

  // Preview Calculation
  estimatedInterestRate: number = 0;
  estimatedMaturityAmount: number = 0;

  message: string = '';

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loadInitData();
  }

  private getAuthToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  //----------------------- Initial Data -----------------------
  loadInitData() {
    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any>('http://localhost:8085/api/loans/apply/init', { headers })
      .subscribe({
        next: (res) => {
          this.accountId = res.account.id;
          this.accountName = res.account.name;
          this.balance = res.account.balance;
          this.accountType = res.account.accountType;
          this.nid = res.account.nid;
          this.phoneNumber = res.account.phoneNumber;
          this.address = res.account.address;

          this.depositAmount = 0;
          this.durationInMonths =0;   // default first month
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to load initial account data');
        }
      });
  }

  //----------------------- Preview Calculation -----------------------
  calculatePreview() {
  // Reset values initially
  this.estimatedInterestRate = 0;
  this.estimatedMaturityAmount = 0;
  this.message = '';

  // Validate input
  if (!this.depositAmount || !this.durationInMonths) {
    return;
  }

// Minimum deposit & duration validation
if (this.depositAmount < 50000 || this.durationInMonths < 12 || this.durationInMonths > 120) {
  this.alertService.warning(
    "FD amount must be at least 50,000 Taka and Duration must be between 12 and 120 months"
  );
  return;
}

  // Insufficient balance check
  if (this.depositAmount > this.balance) {
    this.alertService.warning("Insufficient balance");
    this.durationInMonths=0;
    this.cdr.markForCheck();
    return;
  }


    // Interest Rate Logic (match backend)
  if(this.depositAmount >= 100000) {
    if(this.durationInMonths >= 60) this.estimatedInterestRate = 12;
    else if(this.durationInMonths >= 36) this.estimatedInterestRate = 11;
    else if(this.durationInMonths >= 12) this.estimatedInterestRate = 10;
  } else {
    if(this.durationInMonths >= 12) this.estimatedInterestRate = 7;
  }

  // Maturity Calculation
  this.estimatedMaturityAmount = this.depositAmount +
    (this.depositAmount * this.estimatedInterestRate / 100 * this.durationInMonths / 12);

  // // Interest Rate Logic based on duration
  // if (this.durationInMonths <= 12) {
  //   this.estimatedInterestRate = 10;
  // } else if (this.durationInMonths <= 36) {
  //   this.estimatedInterestRate = 11;
  // } else if (this.durationInMonths <= 60) {
  //   this.estimatedInterestRate = 12;
  // } else {
  //   this.estimatedInterestRate = 5;
  // }

  // // Maturity Calculation
  // this.estimatedMaturityAmount = this.depositAmount +
  //   (this.depositAmount * this.estimatedInterestRate / 100 * this.durationInMonths / 12);
}


  //----------------------- Fixed Deposit Create -----------------------
  fixedDeposit() {
    if (!this.depositAmount || !this.durationInMonths) {
      this.alertService.error('All fields are required! Deposit Amount Must be Atlist 50000/- Taka');
      return;
    }

    const payload = {
      depositAmount: this.depositAmount,
      durationInMonths: this.durationInMonths
    };

    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:8085/api/fd/create', payload, { headers })
      .subscribe({
        next: (res: any) => {
          this.message = `FD Created Successfully! FD ID: ${res.id}`;
          this.alertService.success(this.message);
          this.cdr.markForCheck();
          this.depositAmount = 0;
          this.durationInMonths = 0;
          this.estimatedInterestRate = 0;
          this.estimatedMaturityAmount = 0;
          this.router.navigate(['/invoice']);
        },
        error: (err: any) => {
          console.error(err);
          this.message = err.error || 'Error applying for FD';
          this.alertService.error(this.message);
        }
      });
  }

}
