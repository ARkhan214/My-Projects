
import { Accounts } from './accounts.model';
import { LoanStatus } from './loanStatus';
import { LoanType } from './loanType';

export class Loan {
  id?: number;
  account!: Accounts;
  loanAmount!: number;
  interestRate!: number;
  durationInMonths!: number;
  emiAmount!: number;
  loanType!: LoanType;
  status!: LoanStatus;
  loanStartDate!: Date;
  loanMaturityDate!: Date;
  totalAlreadyPaidAmount!: number;
  remainingAmount!: number;
  penaltyRate!: number;
  lastPaymentDate?: Date | null;
  updatedAt!: Date;
}
