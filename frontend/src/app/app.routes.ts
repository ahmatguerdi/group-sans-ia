import { Routes } from '@angular/router';
import { Inscription } from './users/inscription/inscription';
import { Login } from './users/login/login';

export const routes: Routes = [
  { path: 'inscription', component: Inscription },
  { path: 'login', component: Login },
];
