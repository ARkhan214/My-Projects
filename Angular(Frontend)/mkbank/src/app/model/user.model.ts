import { Role } from "./role.model";

export class User{

    id?:number;
    name!:string;
    email!:string;
    password!:string;
    phoneNumber!:string;
    dateOfBirth!:Date;
    role !:Role;
    photo?: string;  
    
}