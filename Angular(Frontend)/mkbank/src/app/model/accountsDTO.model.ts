export interface AccountsDTO {
  id?: number;
  name: string;
  accountActiveStatus: boolean;
  accountType: string;
  balance: number;
  nid: string;
  phoneNumber: string;
  address: string;
  photo?: string;
  dateOfBirth?: string; // Backend থেকে Date string আসবে
  accountOpeningDate?: string;
  accountClosingDate?: string;
  role?: string;
}
