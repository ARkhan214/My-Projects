import { Accounts } from "./accounts.model";
import { FdStatus } from "./fdStatus";

export class FixedDeposit {

  // id?: number;
  // // account!: Accounts;
  // account?: any;
  // depositAmount!: number;
  // durationInMonths!: number;
  // interestRate!: number;
  // prematureInterestRate!: number;
  // startDate!: Date;
  // maturityDate!: Date;
  // maturityAmount!: number;
  // prematureWithdrawalDate?: Date | null;
  // status!: FdStatus;
  // lastUpdatedAt?: string;
  // fDLustUpdatedAt!: Date;



  id!: number;
  depositAmount?: number;
  durationInMonths?: number;
  interestRate?: number;
  prematureInterestRate?: number;
  startDate?: string;
  maturityDate?: string;
  maturityAmount?: number;
  prematureWithdrawalDate?: string | null;
  status?: string;
  lastUpdatedAt?: string | null;
  account?: {
    id: number;
    name: string;
    accountType: string;
    balance: number;
  };
}

