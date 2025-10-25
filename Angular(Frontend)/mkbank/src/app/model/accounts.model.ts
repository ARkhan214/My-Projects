import { Role } from "./role.model";

export class Accounts{


    id ?:number;
    userId ?:number;
    accountType !:string;
    balance !:number;
    name?: string;
    accountActiveStatus?:boolean;
    photo?: string;
    nid?:string;
    phoneNumber?:string;
    address?:string;
    dateOfBirth?:Date;
    accountOpeningDate?:Date;
    accountClosingDate?:Date;
    role !:Role;
}