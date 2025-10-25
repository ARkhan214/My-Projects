import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from '../../model/employee.model';
import { EmployeeService } from '../../service/employee-service';

@Component({
  selector: 'app-view-all-employee',
  standalone: false,
  templateUrl: './view-all-employee.html',
  styleUrl: './view-all-employee.css'
})
export class ViewAllEmployee implements OnInit {

  employee: Employee[] = [];
  filteredEmployee: Employee[] = [];


  //For Search----Start
  searchById: string = '';
  searchByNid: string = '';
  searchByPhone: string = '';
  searchByPosation: string = '';
  searchBySalary: string = '';
  //For Search----End

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAllAccount().subscribe(emp => {
      this.employee = emp;
      console.log("Accounts from API: ", this.employee);
      this.filteredEmployee = [...emp];
      this.cdr.markForCheck();
    });
  }



  filterById(): void {
    if (!this.searchById) {
      this.filteredEmployee = [...this.employee];
    } else {
      const search = this.searchById.toLowerCase();
      this.filteredEmployee = this.employee.filter(a =>
        a.id?.toString() === search
      );
    }
    this.cdr.markForCheck();
  }

  filterByNid(): void {
    if (!this.searchByNid) {
      this.filteredEmployee = [...this.employee];
    } else {
      const search = this.searchByNid.toLowerCase();
      this.filteredEmployee = this.employee.filter(a =>
        a.nid?.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }

  filterByPhone(): void {
    if (!this.searchByPhone) {
      this.filteredEmployee = [...this.employee];
    } else {
      const search = this.searchByPhone.toLowerCase();
      this.filteredEmployee = this.employee.filter(a =>
        a.phoneNumber?.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }


  filterByPosition(): void {
    if (!this.searchByPosation) {
      this.filteredEmployee = [...this.employee];
    } else {
      const search = this.searchByPosation.toLowerCase();
      this.filteredEmployee = this.employee.filter(a =>
        a.position?.toLowerCase().includes(search)
      );
    }
    this.cdr.markForCheck();
  }


    filterBySalary(): void {
    if (!this.searchBySalary) {
      this.filteredEmployee = [...this.employee];
    } else {
      const search = this.searchBySalary.toLowerCase();
      this.filteredEmployee = this.employee.filter(a =>
        a.salary.toString() === search
      );
    }
    this.cdr.markForCheck();
  }

}
