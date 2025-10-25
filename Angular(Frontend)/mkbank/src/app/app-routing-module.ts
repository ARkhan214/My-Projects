import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Viewallusercomponent } from './components/viewallusercomponent/viewallusercomponent';
import { Usercomponent } from './components/usercomponent/usercomponent';
import { Updateusercomponent } from './components/updateusercomponent/updateusercomponent';
import { ViewAllAccounts } from './components/view-all-accounts/view-all-accounts';
import { DepositComponent } from './components/deposit-component/deposit-component';
import { WithdrawComponent } from './components/withdraw-component/withdraw-component';
import { AboutBank } from './layout/about-bank/about-bank';
import { TransactionComponent } from './components/transaction-component/transaction-component';
import { Addtransaction } from './components/addtransaction/addtransaction';
import { TransactionStatement } from './components/transaction-statement/transaction-statement';
import { Login } from './auth/login/login';
import { UserProfile } from './auth/user-profile/user-profile';
import { AdminProfile } from './auth/admin-profile/admin-profile';
import { ContactUs } from './layout/contact-us/contact-us';
import { UserGuard } from './guards/user-guard';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { OnlyAddUser } from './components/only-add-user/only-add-user';
import { AccountHolderProfile } from './auth/account-holder-profile/account-holder-profile';
import { EmployeeProfile } from './auth/employee-profile/employee-profile';
import { EmployeeComponent } from './components/employee-component/employee-component';
import { Logout } from './auth/logout/logout';
import { EmployeeTransaction } from './components/employee-transaction/employee-transaction';
import { AccTranStatement } from './statements/acc-tran-statement/acc-tran-statement';
import { EmpTranStatement } from './statements/emp-tran-statement/emp-tran-statement';
import { ViewAllEmployee } from './components/view-all-employee/view-all-employee';
import { ForgotPasswordComponent } from './components/forgot-password-component/forgot-password-component';
import { ResetPasswordComponent } from './components/reset-password-component/reset-password-component';
import { WaterBillComponent } from './payments/water-bill-component/water-bill-component';
import { MobileBillComponent } from './payments/mobile-bill-component/mobile-bill-component';
import { CreditCardBillComponent } from './payments/credit-card-bill-component/credit-card-bill-component';
import { ElectricityBillComponent } from './payments/electricity-bill-component/electricity-bill-component';
import { GasBillComponent } from './payments/gas-bill-component/gas-bill-component';
import { InternetBillComponent } from './payments/internet-bill-component/internet-bill-component';
import { ApplyLoanComponent } from './loan/apply-loan-component/apply-loan-component';
import { ViewAllLoans } from './loan/view-all-loans/view-all-loans';
import { PayLoan } from './loan/pay-loan/pay-loan';
import { AdminLoanApproveComponent } from './loan/admin-loan-approve-component/admin-loan-approve-component';
import { FixedDeposit } from './model/fixedDeposit.model';
import { FixedDepositComponent } from './components/fixed-deposit-component/fixed-deposit-component';
import { ViewAllFd } from './components/view-all-fd/view-all-fd';
import { DpsComponent } from './components/dps-component/dps-component';
import { DpsPayComponent } from './components/dps-pay-component/dps-pay-component';
import { ViewAllDPS } from './components/view-all-dps/view-all-dps';
import { AdminGuard } from './guards/admin-guard';
import { AdminEmployeeGuard} from './guards/admin-employee-guard';
import { EmployeeGuard } from './guards/employee-guard';
import { ViewAllLoanForAdmin } from './loan/view-all-loan-for-admin/view-all-loan-for-admin';
import { InvoiceForUser } from './statements/invoice-for-user/invoice-for-user';




const routes: Routes = [
  { path: '', component: Home },
  { path: 'adduser', component: Usercomponent, canActivate: [EmployeeGuard] },
  { path: 'addemployee', component: EmployeeComponent,canActivate: [AdminGuard]},
  { path: 'viewalluser', component: Viewallusercomponent,canActivate: [AdminGuard] },
  { path: 'updateuser/:id', component: Updateusercomponent },
  { path: 'viewallaccount', component: ViewAllAccounts, canActivate: [AdminEmployeeGuard] },
  { path: 'viewallemp', component: ViewAllEmployee,canActivate: [AdminGuard]},
  { path: 'deposit', component: DepositComponent, canActivate: [EmployeeGuard] },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'about', component: AboutBank },
  { path: 'transaction', component: TransactionComponent },
  { path: 'addtr', component: Addtransaction, canActivate: [UserGuard] },
  { path: 'emptr', component: EmployeeTransaction, canActivate: [EmployeeGuard] },
  { path: 'trst', component: TransactionStatement },
  { path: 'acctrst', component: AccTranStatement, canActivate: [UserGuard] },
  { path: 'emptrst', component: EmpTranStatement, canActivate: [AdminEmployeeGuard] },
  { path: 'login', component: Login },
  { path: 'logout', component: Logout },
  { path: 'user-profile', component: UserProfile },
  { path: 'account-profile', component: AccountHolderProfile,canActivate: [UserGuard]  },
  { path: 'employee-profile', component: EmployeeProfile, canActivate: [EmployeeGuard] },
  { path: 'admin-profile', component: AdminProfile,canActivate: [AdminGuard] },
  { path: 'contact', component: ContactUs },
  { path: 'admindash', component: AdminDashboard,canActivate: [AdminGuard] },
  { path: 'onlyadduser', component: OnlyAddUser,canActivate: [AdminGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'water-bill', component: WaterBillComponent, canActivate: [UserGuard] },
  { path: 'mobile-bill', component: MobileBillComponent, canActivate: [UserGuard] },
  { path: 'credit-card-bill', component: CreditCardBillComponent, canActivate: [UserGuard] },
  { path: 'electricity-bill', component: ElectricityBillComponent, canActivate: [UserGuard] },
  { path: 'gas-bill', component: GasBillComponent, canActivate: [UserGuard] },
  { path: 'internet-bill', component: InternetBillComponent, canActivate: [UserGuard] },
  { path: 'apply-loan', component: ApplyLoanComponent, canActivate: [UserGuard] },
  { path: 'view-all-loan', component: ViewAllLoans, canActivate: [UserGuard] },
  { path: 'view-all-loan-for-admin', component:ViewAllLoanForAdmin,canActivate: [AdminGuard] },
  { path: 'pay-loan', component: PayLoan, canActivate: [UserGuard] },
  { path: 'admin-approval-loan', component: AdminLoanApproveComponent,canActivate: [AdminGuard] },
  { path: 'fd', component: FixedDepositComponent,canActivate: [UserGuard] },
  { path: 'view-all-fd', component: ViewAllFd, canActivate: [UserGuard] },
  { path: 'dps', component: DpsComponent, canActivate: [UserGuard] },
  { path: 'dps-pay', component: DpsPayComponent, canActivate: [UserGuard] },
  { path: 'view-all-dps', component: ViewAllDPS, canActivate: [UserGuard] },
  { path: 'invoice', component: InvoiceForUser, canActivate: [UserGuard] },



];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled' //sidebar menu click korle top theke dekhabe.
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
