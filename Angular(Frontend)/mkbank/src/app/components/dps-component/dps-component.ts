import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { AlertService } from '../../service/alert-service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dps-component',
  standalone: false,
  templateUrl: './dps-component.html',
  styleUrl: './dps-component.css'
})
export class DpsComponent {
// === User Input ===
  monthlyAmount!: number;
  termMonths!: number;

    // === Calculated preview ===
  calculatedInterestRate: number = 0;
  estimatedMaturityAmount: number = 0;

  // === Pre-filled account data ===
  accountId!: number;
  accountName: string = '';
  balance!: number;
  accountType: string = '';
  nid: string = '';
  phoneNumber: string = '';
  address: string = '';

  // === DPS info (after create / view) ===
  dpsList: any[] = [];
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
    // this.loadMyDps();
  }

  //  Token Getter
  private getAuthToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  //  Account & Preload Data (যদি backend থেকে আলাদা GET API লাগে, সেটা পরে add করা যাবে)
  loadInitData() {
    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // এখানে তুমি চাইলে backend এ আলাদা `/api/dps/init` endpoint বানাতে পারো
    // এখন account info আমরা শুধু DPS list থেকে বা আলাদা API থেকে আনতে পারি
    this.http.get<any>('http://localhost:8085/api/dps/my-account', { headers })
      .subscribe({
        next: (res) => {
          this.accountId = res.id;
          this.accountName = res.name;
          this.balance = res.balance;
          this.accountType = res.accountType;
          this.nid = res.nid;
          this.phoneNumber = res.phoneNumber;
          this.address = res.address;
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to load account info');
        }
      });
  }


  //  Preview Calculation
  calculatePreview() {
    if (!this.termMonths || !this.monthlyAmount) {
      this.calculatedInterestRate = 0;
      this.estimatedMaturityAmount = 0;
      return;
    }

    // Interest rate logic (match backend rules)
    if (this.termMonths <= 6) this.calculatedInterestRate = 5;
    else if (this.termMonths <= 12) this.calculatedInterestRate = 6;
    else if (this.termMonths <= 24) this.calculatedInterestRate = 7;
    else this.calculatedInterestRate = 8;

    // Estimated maturity amount = total deposit + interest
    this.estimatedMaturityAmount = this.monthlyAmount * this.termMonths * (1 + this.calculatedInterestRate / 100);
  }



  //  DPS Create
  createDps() {
    if (!this.monthlyAmount || !this.termMonths) {
      this.alertService.error('All fields are required!');
      return;
    }

    const payload = {
      monthlyAmount: this.monthlyAmount,
      termMonths: this.termMonths
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

    this.http.post('http://localhost:8085/api/dps/create', payload, { headers })
      .subscribe({
        next: (res: any) => {
          this.message = `DPS Created Successfully! DPS ID: ${res.id}`;
          this.alertService.success(this.message);
          this.cdr.markForCheck();
          this.router.navigate(['/view-all-dps'])
          // this.loadMyDps(); // create হলে সাথে সাথে refresh হবে
        },
        error: (err: any) => {
          console.error(err);
          this.message = err.error || 'Error creating DPS';
          this.alertService.error(this.message);
        }
      });
  }

  //  My DPS List Load
  // loadMyDps() {
  //   const token = this.getAuthToken();
  //   if (!token) {
  //     this.alertService.error('Authentication token not found. Please login again.');
  //     return;
  //   }

  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });

  //   this.http.get<any[]>('http://localhost:8085/api/dps/my-dps', { headers })
  //     .subscribe({
  //       next: (res) => {
  //         this.dpsList = res;
  //         this.cdr.markForCheck();
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.alertService.error('Failed to load your DPS list');
  //       }
  //     });
  // }
}
