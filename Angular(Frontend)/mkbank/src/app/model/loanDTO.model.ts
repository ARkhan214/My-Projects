
import { AccountsDTO } from './accountsDTO.model';

export interface LoanDTO {

  // id: number;
  // loanType: string;
  // amount: number;
  // emiAmount: number;
  // interestRate: number;
  // duration: number;
  // status: string;
  // account: AccountsDTO;


  id: number;
  loanAmount: number;
  interestRate: number;
  emiAmount: number;
  remainingAmount:number;
  totalAlreadyPaidAmount:number;
  status: string;
  loanType: string;
  loanStartDate: Date | string;
  loanMaturityDate:Date | string;
  account: AccountsDTO;
}
