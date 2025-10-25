import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoanDTO } from '../../model/loanDTO.model';
import { LoanService } from '../../service/loan-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-all-loans',
  standalone: false,
  templateUrl: './view-all-loans.html',
  styleUrl: './view-all-loans.css'
})
export class ViewAllLoans implements OnInit {

  loans: LoanDTO[] = [];
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private loanService: LoanService,
    private http: HttpClient,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  isLoggedIn(): boolean {
  const token = localStorage.getItem('authToken');
  return !!token; 
}


  loadLoans(): void {
    this.loanService.getMyLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.cdr.markForCheck();
        this.loading = false;
        
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMessage = 'Unauthorized! Please login again.';
        } else {
          this.errorMessage = 'Failed to load loans';
        }
        console.error('Loan load error:', err);
        this.loading = false;
      }
    });
  }
}
