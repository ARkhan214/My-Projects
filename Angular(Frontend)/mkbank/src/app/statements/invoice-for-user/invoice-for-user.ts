import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TransactionDTO } from '../../model/transactionStatementDTO.model';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Transactionsservice } from '../../service/transactionsservice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoice-for-user',
  standalone: false,
  templateUrl: './invoice-for-user.html',
  styleUrl: './invoice-for-user.css'
})
export class InvoiceForUser implements OnInit {


  transactions: TransactionDTO[] = [];
  currentTransaction: TransactionDTO | null = null;
  currentIndex: number = -1;

  private baseUrl = environment.springUrl;

  constructor(
    private http: HttpClient,
    private transactionService: Transactionsservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.transactionService.getStatement().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.transactions = data;
          this.currentIndex = data.length - 1; // last transaction
          this.currentTransaction = this.transactions[this.currentIndex];
        }
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load transactions', err)
    });
  }

  showPrevious(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentTransaction = this.transactions[this.currentIndex];
    }
  }

  showNext(): void {
    if (this.currentIndex < this.transactions.length - 1) {
      this.currentIndex++;
      this.currentTransaction = this.transactions[this.currentIndex];
    }
  }

  exportHTMLPDF() {
    const element: any = document.querySelector('.invoice-container');
    if (!element) return;

    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.html(element, {
      callback: (pdf) => pdf.save(`invoice-${this.currentTransaction?.id}.pdf`),
      x: 13,
      y: 13,
      html2canvas: {
        scale: 0.25,
        letterRendering: true,
        useCORS: true,
        
      },
      width: 300
    });
  }

  exportAutoTablePDF() {
    if (!this.currentTransaction) return;

    const tx = this.currentTransaction;
    const account = tx.account;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(0, 51, 102);
    pdf.text('MK Bank PLC.', 105, 15, { align: 'center' });
    pdf.text('Customer Invoice', 105, 26, { align: 'center' });

    pdf.setDrawColor(0, 51, 102);
    pdf.setLineWidth(0.6);
    pdf.line(15, 34, 195, 34);

    // Customer Info
    pdf.setFontSize(14);
    pdf.text('Customer Information', 15, 45);

    pdf.setFontSize(11);
    const labelColor: [number, number, number] = [80, 80, 80];
    const valueColor: [number, number, number] = [0, 0, 0];

    const leftXLabel = 15, leftXValue = 55;
    const rightXLabel = 110, rightXValue = 150;

    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
    pdf.text('Customer ID:', leftXLabel, 55);
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
    pdf.text(`${account.id}`, leftXValue, 55);

    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
    pdf.text('Name:', leftXLabel, 62);
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
    pdf.text(`${account.name}`, leftXValue, 62);

    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
    pdf.text('Address:', leftXLabel, 69);
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
    pdf.text(`${account.address}`, leftXValue, 69);

    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
    pdf.text('Account Type:', rightXLabel, 55);
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
    pdf.text(`${account.accountType}`, rightXValue, 55);

    const openingDate = account.accountOpeningDate
      ? new Date(account.accountOpeningDate).toLocaleDateString()
      : '---';

    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
    pdf.text('Opening Date:', rightXLabel, 62);
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
    pdf.text(openingDate, rightXValue, 62);

    pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
    pdf.text('Telephone:', rightXLabel, 69);
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
    pdf.text(account.phoneNumber, rightXValue, 69);

    // Transaction Table
    autoTable(pdf, {
      head: [['Date', 'Transaction ID', 'Type', 'Transaction Type', 'Amount', 'Description']],
      body: [[
        tx.transactionTime ? new Date(tx.transactionTime).toLocaleString() : '',
        tx.id,
        tx.type || '',
        tx.transactionType || '',
        tx.amount !== undefined ? tx.amount.toFixed(2) : '',
        tx.description || ''
      ]],
      startY: 85,
      theme: 'grid',
      headStyles: { fillColor: [0,51,102], textColor: [255,255,255], fontStyle:'bold', halign:'center' },
      styles: { fontSize: 10, cellPadding: 2 }
    });

    // Footer
    const finalY = (pdf as any).lastAutoTable.finalY + 10;
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text("This invoice has been generated by MK Bank iBanking. No signature required.", 15, finalY);

    pdf.save(`invoice-${tx.id}.pdf`);
  }



  
  //--------------------------------------------

  // transaction: TransactionDTO[] = [];
  // private baseUrl = environment.springUrl;

  // constructor(
  //   private http: HttpClient,
  //   private transactionService: Transactionsservice,
  //   private cdr: ChangeDetectorRef
  // ) { }

  // ngOnInit(): void {
  //   this.transactionService.getStatement().subscribe({
  //     next: (data) => {
  //       if (data && data.length > 0) {
  //         this.transaction = [data[data.length - 1]];
  //       } else {
  //         this.transaction = [];
  //       }
  //       this.cdr.markForCheck();
  //     },
  //     error: (err) => {
  //       console.error('Failed to load transactions', err);
  //     }
  //   });
  // }


  // exportHTMLPDF() {
  //   const element: any = document.querySelector('.invoice-container');
  //   if (!element) return;

  //   // Landscape A4
  //   const pdf = new jsPDF('p', 'mm', 'a4');

  //   pdf.html(element, {
  //     callback: (pdf) => pdf.save(`invoice-${this.transaction[0].id}.pdf`),
  //     x: 13,
  //     y: 13,
  //     html2canvas: {
  //       scale: 0.25,  // Landscape-এ content 1-page-এ fit
  //       letterRendering: true,
  //       useCORS: true
  //     },
  //     width: 300 // landscape A4 approximate width in mm
  //   });
  // }



  // exportAutoTablePDF() {
  //   if (!this.transaction || this.transaction.length === 0) {
  //     console.error('No transactions to export.');
  //     return;
  //   }

  //   const tx = this.transaction[0];
  //   const account = tx.account;
  //   const pdf = new jsPDF('p', 'mm', 'a4');

  //   // -------- Header ----------
  //   pdf.setFont('helvetica', 'bold');
  //   pdf.setFontSize(22);
  //   pdf.setTextColor(0, 51, 102);
  //   pdf.text('MK Bank PLC.', 105, 15, { align: 'center' });

  //   pdf.setFont('helvetica', 'bold');
  //   pdf.setFontSize(22);
  //   pdf.setTextColor(0, 51, 102);
  //   pdf.text('Customer Invoice', 105, 26, { align: 'center' });

  //   pdf.setDrawColor(0, 51, 102);
  //   pdf.setLineWidth(0.6);
  //   pdf.line(15, 34, 195, 34);

  //   // -------- Customer Info ----------
  //   pdf.setFontSize(14);
  //   pdf.setFont('helvetica', 'bold');
  //   pdf.setTextColor(0, 51, 102);
  //   pdf.text('Customer Information', 15, 45);

  //   pdf.setFontSize(11);
  //   const labelColor: [number, number, number] = [80, 80, 80];
  //   const valueColor: [number, number, number] = [0, 0, 0];

  //   const leftXLabel = 15, leftXValue = 55;
  //   const rightXLabel = 110, rightXValue = 150;

  //   // Left column
  //   pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
  //   pdf.text('Customer ID:', leftXLabel, 55);
  //   pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
  //   pdf.text(`${account.id}`, leftXValue, 55);

  //   pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
  //   pdf.text('Name:', leftXLabel, 62);
  //   pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
  //   pdf.text(`${account.name}`, leftXValue, 62);

  //   pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
  //   pdf.text('Address:', leftXLabel, 69);
  //   pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
  //   pdf.text(`${account.address}`, leftXValue, 69);

  //   // Right column
  //   pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
  //   pdf.text('Account Type:', rightXLabel, 55);
  //   pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
  //   pdf.text(`${account.accountType}`, rightXValue, 55);

  //   const openingDate = account.accountOpeningDate
  //     ? new Date(account.accountOpeningDate).toLocaleDateString()
  //     : '---';

  //   pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
  //   pdf.text('Opening Date:', rightXLabel, 62);
  //   pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
  //   pdf.text(openingDate, rightXValue, 62);

  //   pdf.setFont('helvetica', 'bold'); pdf.setTextColor(...labelColor);
  //   pdf.text('Telephone:', rightXLabel, 69);
  //   pdf.setFont('helvetica', 'normal'); pdf.setTextColor(...valueColor);
  //   pdf.text(account.phoneNumber, rightXValue, 69);

  //   // -------- Transactions Table ----------
  //   const tableRows: (string | number)[][] = this.transaction.map(tx => [
  //     tx.transactionTime ? new Date(tx.transactionTime).toLocaleString() : '',
  //     tx.id,
  //     tx.type || '',
  //     tx.transactionType || '',
  //     tx.amount !== undefined ? tx.amount.toFixed(2) : '',
  //     tx.description || ''
  //   ]);

  //   autoTable(pdf, {
  //     head: [['Date', 'Transaction ID', 'Type', 'Transaction Type', 'Amount', 'Description']],
  //     body: tableRows,
  //     startY: 85,
  //     theme: 'grid',
  //     headStyles: { fillColor: [0,51,102], textColor: [255,255,255], fontStyle:'bold', halign:'center' },
  //     styles: { fontSize: 10, cellPadding: 2 }
  //   });

  //   // -------- Footer ----------
  //   const finalY = (pdf as any).lastAutoTable.finalY + 10;
  //   pdf.setFontSize(9);
  //   pdf.setTextColor(100);
  //   pdf.text(
  //     "This invoice has been generated by MK Bank iBanking. No signature required.",
  //     15,
  //     finalY
  //   );

  //   pdf.save(`invoice-${tx.id}.pdf`);
  // }


}
