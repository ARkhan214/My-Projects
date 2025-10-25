import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

//   openAccountClicked(event: Event) {
//   event.preventDefault(); // এইটা href="#" এর ডিফল্ট রিলোড আটকে রাখে
//   alert('Before opening an account, you must be a registered user.\n' +
//     'If you are not a user, please go to the Add User page.\n' +
//     'If you are already a user, please go to the Login page.');
// }

currentYear: number = new Date().getFullYear();

  stats = [
    { label: 'Customers', value: 125000, unit: '', small: 'Satisfied users' },
    { label: 'Transactions', value: 4200000, unit: '', small: 'Processed monthly' },
    { label: 'Support', value: 24, unit: '/7', small: 'Live' },
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // অন্য initialization কাজ এখানে রাখতে পারো
  }

  ngAfterViewInit(): void {
    // DOM ready হওয়ার পরে counter animate করা
    this.animateCounters();
  }

  // Browser-safe animateCounters
  animateCounters(): void {
    if (typeof document === 'undefined') return; // Node বা SSR environment skip

    setTimeout(() => {
      const counters = document.querySelectorAll<HTMLElement>('.stat');
      counters.forEach(counter => {
        const target = Number(counter.getAttribute('data-target') || '0');
        let current = 0;
        const increment = Math.ceil(target / 200);

        const update = () => {
          current = Math.min(current + increment, target);
          counter.innerText = current.toLocaleString();
          if (current < target) {
            requestAnimationFrame(update);
          }
        };

        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              update();
              observer.disconnect();
            }
          });
        }, { threshold: 0.4 });

        observer.observe(counter);
      });
    }, 0);
  }

  // Browser-safe scrollTo
  scrollTo(sectionId: string): void {
    if (typeof document === 'undefined') return;

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  logout(): void {
    this.authService.logout();
  }
  
}