import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TransactionDTO } from '../../model/transactionStatementDTO.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Transactionsservice } from '../../service/transactionsservice';


// Import jsPDF and html2canvas for PDF export
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TransactionType } from '../../model/transactionType.model';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-acc-tran-statement',
  standalone: false,
  templateUrl: './acc-tran-statement.html',
  styleUrl: './acc-tran-statement.css'
})
export class AccTranStatement implements OnInit {


  @ViewChild('transactionTable') transactionTable!: ElementRef; // Get table reference

  transactions: TransactionDTO[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  totalWithdraw: number = 0;
  totalDeposit: number = 0;
  totalBalance: number = 0;

  //For Traansaction Statement Filter Start-------------------
  startDate: string = '';
  endDate: string = '';
  type: string = '';
  transactionType!: TransactionType;
  //For Traansaction Statement Filter End----------------------


  private baseUrl = environment.springUrl;

  constructor(
    private http: HttpClient,
    private transactionService: Transactionsservice,
    private cdr: ChangeDetectorRef


  ) { }

  ngOnInit(): void {
    // this.getTransactionStatement();

    this.transactionService.getStatement().subscribe({
      next: (data) => {
        this.transactions = data;
        console.log(data + "Profile data ");
        this.computeTotals();
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });
  }

  computeTotals() {
    this.totalWithdraw = 0;
    this.totalDeposit = 0;
    this.totalBalance = 0;

    let runningBalance = 0;

    for (let tx of this.transactions) {
      if (tx.type === 'DEBIT') {
        this.totalWithdraw += tx.amount!;
        runningBalance -= tx.amount!;
      } else if (tx.type === 'CREDIT') {
        this.totalDeposit += tx.amount!;
        runningBalance += tx.amount!;
      }

      // প্রতিটি ট্রানজেকশনের জন্য running balance সেট
      tx.runningBalance = runningBalance;
    }

    this.totalBalance = runningBalance;
  }



  //For Traansaction Statement Filter Start---------------------
  applyFilter() {
    this.loading = true;
    this.errorMessage = '';

    this.transactionService.getTransactionsWithFilterForAccountHolder(
      this.startDate,
      this.endDate,
      this.type,
      this.transactionType
    ).subscribe({
      next: (data) => {
        this.transactions = data;
        this.computeTotals();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load filtered transactions', err);
        this.errorMessage = 'Failed to load filtered transactions';
        this.transactions = [];
        this.loading = false;
      }
    });
  }


  onTypeChange() {
    this.applyFilter();
  }


  //For Traansaction Statement Filter End------------




  // exportPDF() {
  //   if (!this.transactions || this.transactions.length === 0) {
  //     console.error('No transactions to export.');
  //     return;
  //   }

  //   const data = this.transactionTable?.nativeElement;
  //   if (!data) {
  //     console.error('Table element not found for PDF export');
  //     return;
  //   }

  //   html2canvas(data, { scale: 2 }).then(canvas => {
  //     const imgWidth = 180; // Table image width
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  //     const contentDataURL = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     // ---------- Header ----------
  //     pdf.setTextColor(0, 51, 102); // Dark blue
  //     pdf.setFontSize(20);
  //     pdf.text('MK Bank', 105, 15, { align: 'center' });

  //     pdf.setTextColor(0, 0, 0); // Black for subtitle
  //     pdf.setFontSize(16);
  //     pdf.text('Transaction Statement', 105, 25, { align: 'center' });

  //     // ---------- Account Info ----------
  //     const account = this.transactions[0].account;

  //     pdf.setFontSize(12);
  //     pdf.setTextColor(0, 0, 0); // black text
  //     pdf.text(`Account Holder: ${account.name}`, 15, 35);
  //     pdf.text(`Customer ID: ${account.id}`, 15, 42);
  //     pdf.text(`Address: ${account.address}`, 15, 49);
  //     pdf.text(`Account Type: ${account.accountType}`, 15, 56);
  //     pdf.text(`Opening Date: ${account.accountOpeningDate}`, 15, 63);
  //     pdf.text(`Telephone: ${account.phoneNumber}`, 15, 70);

  //     // ---------- Add Table Image ----------
  //     const tableY = 75; // Leave space after header
  //     pdf.addImage(contentDataURL, 'PNG', 15, tableY, imgWidth, imgHeight);

  //     // Save PDF
  //     pdf.save('transaction-statement.pdf');
  //   });
  // }


  exportPDF() {
    if (!this.transactions || this.transactions.length === 0) {
      console.error('No transactions to export.');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');

    // -------- Header Section ----------
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);
    pdf.setFontSize(22);
    pdf.text('MK Bank PLC.', 105, 15, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(80);
    pdf.text('Head Office, Dhaka', 105, 22, { align: 'center' });
    pdf.setTextColor(120, 120, 120);
    pdf.text('Trusted Banking Partner Since 1990', 105, 28, { align: 'center' });

    // Decorative Line
    pdf.setDrawColor(0, 51, 102);
    pdf.setLineWidth(0.6);
    pdf.line(15, 34, 195, 34);

    // -------- Customer Info Section (Professional Look) ----------
    const account = this.transactions[0].account;

    // Column positions
    const leftXLabel: number = 15;
    const leftXValue: number = 55;
    const rightXLabel: number = 110;
    const rightXValue: number = 150;

    // Colors as tuple for TypeScript
    const labelColor: [number, number, number] = [80, 80, 80];  // Grey for labels
    const valueColor: [number, number, number] = [0, 0, 0];     // Black for values

    // Section Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);            // Slightly bigger for title
    pdf.setTextColor(0, 51, 102);   // Dark blue
    pdf.text('Customer Information', 15, 45);

    // Left Column
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...labelColor);
    pdf.text('Customer ID:', leftXLabel, 55);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...valueColor);
    pdf.text(`${account.id}`, leftXValue, 55);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...labelColor);
    pdf.text('Name:', leftXLabel, 62);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...valueColor);
    pdf.text(`${account.name}`, leftXValue, 62);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...labelColor);
    pdf.text('Address:', leftXLabel, 69);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...valueColor);
    pdf.text(`${account.address}`, leftXValue, 69);

    // Right Column
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...labelColor);
    pdf.text('Account Type:', rightXLabel, 55);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...valueColor);
    pdf.text(`${account.accountType}`, rightXValue, 55);

    const openingDate = account.accountOpeningDate
      ? new Date(account.accountOpeningDate).toISOString().split('T')[0]
      : '---';

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...labelColor);
    pdf.text('Opening Date:', rightXLabel, 62);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...valueColor);
    pdf.text(`${openingDate}`, rightXValue, 62);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...labelColor);
    pdf.text('Telephone:', rightXLabel, 69);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...valueColor);
    pdf.text(`${account.phoneNumber}`, rightXValue, 69);


    // -------- Report Date (Top Right, before table) ----------
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 51, 102);

    const generatedDate = new Date().toLocaleString();

    pdf.text(
      `Report generated: ${generatedDate}`,
      195,
      85,
      { align: 'right' }
    );

    // -------- Transactions Table ----------
    const tableRows: any[] = [];

    this.transactions.forEach(tx => {
      tableRows.push([
        tx.transactionTime ? new Date(tx.transactionTime).toLocaleDateString() : '',
        tx.description || '',
        tx.id || '',
        // tx.receiverAccount?.name || '',
        tx.type || '',
        tx.transactionType || '',
        tx.type === 'DEBIT' ? tx.amount?.toFixed(2) : '',
        tx.type === 'CREDIT' ? tx.amount?.toFixed(2) : '',
        tx.runningBalance?.toFixed(2) || ''
      ]);
    });

    // Totals row
    tableRows.push([
      "", "TOTAL", "", "", "",
      this.totalWithdraw.toFixed(2),
      this.totalDeposit.toFixed(2),
      this.totalBalance.toFixed(2)
    ]);

    // AutoTable
    autoTable(pdf, {
      head: [['Date', 'Particulars', 'Instrument No', 'Type', 'Transaction Type', 'Withdraw', 'Deposit', 'Balance']],
      body: tableRows,
      startY: 95,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 51, 102],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: { fontSize: 9, cellPadding: 2 },
      alternateRowStyles: { fillColor: [240, 248, 255] },
      footStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    // -------- Footer ----------
    const finalY = (pdf as any).lastAutoTable.finalY + 15;
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(
      "This report has been generated from MK Bank iBanking based on available data. No signature required.",
      15,
      finalY
    );

    // Save file
    pdf.save('transaction-statement.pdf');

  }

}