import { Accounts } from "./accounts.model";
import { TransactionType } from "./transactionType.model";

export class Transaction {

    id?:number;
    type!:TransactionType;
    companyName?:string;
    accountHolderBillingId?:string;
    amount !: number;
    transactionTime !: Date;
    description?: string;
    accountId !: number;
    receiverAccountId ?: number;
 }