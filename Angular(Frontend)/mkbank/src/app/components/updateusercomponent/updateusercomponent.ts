import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-updateusercomponent',
  standalone: false,
  templateUrl: './updateusercomponent.html',
  styleUrl: './updateusercomponent.css'
})
export class Updateusercomponent implements OnInit{

  id !:number;
  user: User = new User();

  constructor(
    private userservice: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadUserById();
  }

   loadUserById(): void {
    this.userservice.getUserById(this.id).subscribe({
      next: (res) => {
        this.user=res;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error fetching User:', err)
    });
  }

  updateUser(): void {
    this.userservice.updateUser(this.id, this.user).subscribe({
      next: () => this.router.navigate(['/viewalluser']),
      error: (err) => console.error('Update failed:', err)
    });
  }

}
