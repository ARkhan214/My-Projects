import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee-service';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeStatus } from '../../model/employeeStatus.model';
import { Position } from '../../model/position.model';
import { User } from '../../model/user.model';
import { Role } from '../../model/role.model';
import { Employee } from '../../model/employee.model';
import { AlertService } from '../../service/alert-service';

@Component({
  selector: 'app-employee-component',
  standalone: false,
  templateUrl: './employee-component.html',
  styleUrl: './employee-component.css'
})
export class EmployeeComponent implements OnInit {

  userEmployeeForm!: FormGroup;
  selectedFile: File | null = null;

  employee: Employee = new Employee(); // instance
  Role = Role; //Role enum use for template 
  EmployeeStatus = EmployeeStatus; //EmployeeStatus  enum use for template  
  Position = Position; // Position enum use fot template


  constructor(
    private userService: UserService,
    private alertService:AlertService,
    private employeeService: EmployeeService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userEmployeeForm = this.formbuilder.group({
      // User fields
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      role: [''],
      photo: [''],

      //Employee Part
      status: [EmployeeStatus.ACTIVE,Validators.required],
      nid: ['', Validators.required],
      address: ['', Validators.required],
      position: [''],
      salary: [''],
      dateOfJoining: [''],
      retirementDate: ['']
    })
  }

    onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


  //onSubmit
  onSubmit() {
    if (this.userEmployeeForm.valid) {
      const formValues = this.userEmployeeForm.value;

      const userObj: User = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        phoneNumber: formValues.phoneNumber,
        dateOfBirth: formValues.dateOfBirth,
        role: Role.USER,
        photo: formValues.photo
      };

      const employeeObj: Employee = {
        name: formValues.name,
        status: formValues.status,
        nid: formValues.nid,
        address: formValues.address,
        position: formValues.position,
        photo: formValues.photo,
        salary: formValues.salary,
        phoneNumber: formValues.phoneNumber,
        dateOfJoining: formValues.dateOfJoining,
        dateOfBirth: formValues.dateOfBirth,
        retirementDate: formValues.retirementDate,
        role: Role.EMPLOYEE,
        user: userObj
      };


      //Using Blob
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(userObj)], { type: 'application/json' }));
    formData.append('employee', new Blob([JSON.stringify(employeeObj)], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

      this.employeeService.registerEmployee(formData).subscribe({
        next: () => {
          // alert('User and Employee Saved Successfully!');
          this.alertService.success('User and Employee Saved Successfully!');
          this.userEmployeeForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error(err);
          // alert('Failed to Save User and Employee.');
          this.alertService.error('Failed to Save User and Employee.');
        }
      });
    }

        else {
      this.alertService.error('Please fill all required fields!');
    }

  }


}
