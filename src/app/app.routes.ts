import { Routes } from '@angular/router';
import { LoginComponent } from './users/login/login.component';
import { AuthGuard, NoAuthGuard } from './shared/auth/auth.guard';
import { HumanResourcesComponent } from './users/human-resources/human-resources.component';
import { AdminitrativeComponent } from './users/adminitrative/adminitrative.component';
import { MedicalStaffComponent } from './users/medical-staff/medical-staff.component';

export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'Human_Resources', component: HumanResourcesComponent, canActivate: [AuthGuard] },
    { path: 'Administrative', component: AdminitrativeComponent, canActivate: [AuthGuard] },
    { path: 'Medical_Staff', component: MedicalStaffComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: 'Login'},
];
