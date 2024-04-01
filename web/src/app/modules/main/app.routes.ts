import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SettingComponent } from './components/setting/setting.component';

export const routes: Routes = [
    // redirect to landing page
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    { path: 'setting', component: SettingComponent },
    { path: '', component: LoginComponent },
];
