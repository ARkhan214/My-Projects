import { Accounts } from "./accounts.model";
import { DpsStatus } from "./dpsStatus";

export class Dps {
    id?: number;
    account!: Accounts;
    monthlyInstallment!: number;
    durationInMonths!: number;
    startDpsDate!: Date;
    dpsMaturityDate!: Date;
    interestRate!: number;
    maturityAmount!: number;
    totalDepositsMade!: number;
    dpsStatus!: DpsStatus;
    dpsLastUpdatedAt!: Date;
}