import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { FixedDeposit } from '../../model/fixedDeposit.model';
import { FixedDepositService } from '../../service/fixed-deposit-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-view-all-fd',
  standalone: false,
  templateUrl: './view-all-fd.html',
  styleUrl: './view-all-fd.css'
})
export class ViewAllFd {

  fds: FixedDeposit[] = [];
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private fdService: FixedDepositService,
              private cdr: ChangeDetectorRef,
            @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loadFDs();
  }
    private getAuthToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  loadFDs(): void {
    this.loading = true;
    this.fdService.getMyFDs().subscribe({
      next: (data) => {
        this.fds = data;
        this.cdr.markForCheck();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.status === 403 ? 'Unauthorized! Please login again.' : 'Failed to load Fixed Deposits';
        console.error('FD load error:', err);
        this.loading = false;
      }
    });
  }


confirmClose(fdId: number, accountId?: number): void {
  if (!accountId) {
    alert('Account ID not available!');
    return;
  }

  if (confirm('Are you sure you want to close this FD?')) {
    // Get JWT token
    const token = this.getAuthToken();
    if (!token) {
      alert('You are not authenticated. Please login.');
      return;
    }

    // Set headers with Authorization
    const headers = { 'Authorization': `Bearer ${token}` };

    this.fdService.closeFD(fdId, accountId, headers).subscribe({
      next: (res) => {
        alert('FD closed successfully!');
        this.loadFDs(); // Refresh the list
      },
      error: (err) => {
        console.error('Error closing FD:', err);
        alert('Failed to close FD. Check console for details.');
      }
    });
  }
}





// confirmClose(fdId: number, accountId?: number): void {
//   if (!accountId) {
//     alert('Account ID not available!');
//     return;
//   }

//   if (confirm('Are you sure you want to close this FD?')) {
//     this.fdService.closeFD(fdId, accountId).subscribe({
//       next: (res) => {
//         alert('FD closed successfully!');
//         this.loadFDs(); // Refresh the list
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Failed to close FD');
//       }
//     });
//   }
// }


}
