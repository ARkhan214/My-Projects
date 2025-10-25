import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';
import { UserRegistration } from './registration/user-registration/user-registration';
import { ConsumerProfile } from './consumer/consumer-profile/consumer-profile';

export const routes: Routes = [

    { path: '', component: HomePage },
    { path: 'registration', component: UserRegistration },
    { path: 'conprofile', component: ConsumerProfile },

];
