import { AccountsDTO } from "./accountsDTO.model";

export class TransactionDTO {


    // id?: number;
    // accountHolderName?: string;
    // receiverAccountId?: number | null;
    // receiverAccountName?: string | null;
    // type?: string; // DEBIT or CREDIT
    // transactionType?: string;
    // amount?: number;
    // transactionTime?: string; // ISO string
    // description?: string;
    // // New fields for bill payment
    // companyName?: string;            // Bill company (DESCO, TITAS, etc.)
    // accountHolderBillingId?: string; // Customer billing reference




    id!: number;

    // Full account (sender)
    account!: AccountsDTO;

    // Receiver account may be null
    receiverAccount?: AccountsDTO | null;

    // Transaction details
    type?: string;              // DEBIT or CREDIT
    transactionType?: string;   // e.g., TRANSFER, BILL_PAYMENT
    amount?: number;
    transactionTime?: string;   // ISO string
    description?: string;

    // Bill payment fields
    companyName?: string;
    accountHolderBillingId?: string;

    
  // Extra field for frontend use
 runningBalance?: number;


}



