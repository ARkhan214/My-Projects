import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../service/auth-service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../../model/role.model';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.html',
  styleUrl: './logout.css'
})
export class Logout{

}
