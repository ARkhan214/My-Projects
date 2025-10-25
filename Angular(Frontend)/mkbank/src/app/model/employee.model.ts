import { EmployeeStatus } from "./employeeStatus.model";
import { Position } from "./position.model";
import { Role } from "./role.model";
import { User } from "./user.model";

export class Employee {
  id?: number;
  name!: string;
  status: EmployeeStatus = EmployeeStatus.ACTIVE;
  nid!: string;
  phoneNumber!: string;
  address?: string;
  position!: Position;
  salary!: number;
  dateOfJoining!: Date;
  dateOfBirth!: Date;
  retirementDate?: Date;
  user!: User;
  photo?: string;
  role!: Role;
}