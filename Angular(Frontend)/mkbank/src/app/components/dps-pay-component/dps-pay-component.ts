import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../service/alert-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dps-pay-component',
  standalone: false,
  templateUrl: './dps-pay-component.html',
  styleUrl: './dps-pay-component.css'
})
export class DpsPayComponent implements OnInit {

  dpsId: number | null = null;           // DPS ID input
  dpsData: any = null;                   // DPS details loaded from backend
  allDpsList: any[] = [];                // All DPS from backend
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  //===========================================
  //past oninit methode
  // ngOnInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const savedDpsId = localStorage.getItem('dpsId');
  //     if (savedDpsId) {
  //       this.dpsId = Number(savedDpsId);
  //     }

  //     if (this.dpsId) {
  //       this.fetchDpsDetails();
  //     }
  //   }
  // }



  //new oninit methode

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllDps();
    }
  }


  //==========================================

  private getAuthToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }



  //========Data Load For Dropdown=====Start==========
  // Load all DPS for logged-in user

  loadAllDps(): void {
    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get(`http://localhost:8085/api/dps/my-dps`, { headers })
      .subscribe({
        next: (res: any) => {
          this.allDpsList = res || [];
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error(err);
          this.alertService.error('⚠ Failed to load DPS list.');
        }
      });
  }
  //=============end======================



  // Load selected DPS details

  fetchDpsDetails(): void {
    if (!this.dpsId) {
      this.errorMessage = 'Please enter DPS ID';
      this.alertService.error(this.errorMessage);
      this.dpsData = null;
      return;
    }

    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get(`http://localhost:8085/api/dps/${this.dpsId}`, { headers })
      .subscribe({
        next: (res: any) => {
          this.dpsData = res;
          this.errorMessage = '';
          this.alertService.success('✅ DPS details loaded successfully!');
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = err.error || 'DPS not found';
          this.alertService.error(this.errorMessage);
          this.dpsData = null;
        }
      });
  }


  // Pay monthly DPS
  payDps(): void {
    if (!this.dpsId) {
      this.errorMessage = 'Please enter valid DPS ID';
      this.alertService.error(this.errorMessage);
      this.successMessage = '';
      return;
    }

    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post(`http://localhost:8085/api/dps/pay/${this.dpsId}`, {}, { headers, responseType: 'text' })
      .subscribe({
        next: (res: any) => {
          this.successMessage = res || 'Monthly DPS payment successful!';
          this.alertService.success(this.successMessage);
          this.dpsData = null;
          this.dpsId = null;
          this.loadAllDps(); // refresh dropdown after payment
          this.cdr.markForCheck();
          this.router.navigate(['/invoice']);
          this.loading = false;
        },
        error: (err: any) => {
          console.error(err);

          // Backend DPS closed exception handle
          if (err.status === 500 && err.error.includes('DPS is closed')) {
            this.errorMessage = '❌ This DPS is already closed. No further payments allowed.';
            this.alertService.error(this.errorMessage);
          } else {
            this.errorMessage = err.error || '⚠ Payment failed. Please try again.';
            this.alertService.error(this.errorMessage);
          }

          this.loading = false;
        }
      });
  }

  resetForm(): void {
    this.dpsId = null;
    this.dpsData = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = false;
    this.alertService.success('✅ DPS form reset successfully.');
  }

}
