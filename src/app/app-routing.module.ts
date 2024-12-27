import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RhDashComponent } from './components/rh-dash/rh-dash.component';
import { EmployeDashComponent } from './components/employe-dash/employe-dash.component';
import { CongeRhComponent } from './components/conge-rh/conge-rh.component';
import { EmployeCongeComponent } from './employe-conge/employe-conge.component';
import { UserService } from './services/user.service';
import { EmplAbsenceComponent } from './empl-absence/empl-absence.component';
import { RhEmployesComponent } from './components/rh-employes/rh-employes.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { RhAbsencesComponent } from './rh-absences/rh-absences.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'profile/:id', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rh', component: RhDashComponent },
  { path: 'employe', component: EmployeDashComponent },

  // Routes accessibles uniquement par les employés
  { path: 'employeDash', component: EmployeDashComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYE' } },
  { path: 'employeAbsence', component: EmplAbsenceComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYE' } },
  { path: 'employeConge', component: EmployeCongeComponent, canActivate: [AuthGuard], data: { role: 'EMPLOYE' } },
  
  // Routes accessibles uniquement par les RH
  { path: 'rhDash', component: RhDashComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'conge', component: CongeRhComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'rhEmployes', component: RhEmployesComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'addEmploye', component: AddUserComponent, canActivate: [AuthGuard], data: { role: 'RH' } },
  { path: 'rhAbsences', component: RhAbsencesComponent, canActivate: [AuthGuard], data: { role: 'RH' } },

  // Route par défaut
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
