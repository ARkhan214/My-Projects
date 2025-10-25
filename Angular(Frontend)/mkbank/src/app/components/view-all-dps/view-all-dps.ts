import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AlertService } from '../../service/alert-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-view-all-dps',
  standalone: false,
  templateUrl: './view-all-dps.html',
  styleUrl: './view-all-dps.css'
})
export class ViewAllDPS implements OnInit{
dpsList: any[] = [];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadAllDps();
  }

  private getAuthToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  loadAllDps(): void {
    this.loading = true;
    const token = this.getAuthToken();
    if (!token) {
      this.alertService.error('Authentication token not found. Please login again.');
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Backend endpoint to fetch all DPS
    this.http.get<any[]>('http://localhost:8085/api/dps/my-dps', { headers })
      .subscribe({
        next: (res) => {
          this.dpsList = res;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to load DPS accounts');
          this.loading = false;
        }
      });
  }
}
