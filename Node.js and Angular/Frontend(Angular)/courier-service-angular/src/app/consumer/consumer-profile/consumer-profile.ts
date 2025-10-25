import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // ✅ HttpClientModule
import { ConsumerService } from '../consumer-service';

@Component({
  selector: 'app-consumer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // ✅ এখানে add করতে হবে
  templateUrl: './consumer-profile.html',
  styleUrls: ['./consumer-profile.css']
})
export class ConsumerProfile {
 


}
