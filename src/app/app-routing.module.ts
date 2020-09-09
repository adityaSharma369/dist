import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {NonAuthGuard} from './shared/guards/non-auth.guard';
import {AppLayoutComponent} from './layouts/app-layout/app-layout.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MapComponentComponent} from './map-component/map-component.component';


const routes: Routes = [
  {
    path: '', component: AppLayoutComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: '', loadChildren: () => import('./app-inner/app-inner.module').then(m => m.AppInnerModule)},
    ]
  },
  {
    path: '', component: AuthLayoutComponent, canActivate: [NonAuthGuard], children: [
      {path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
    ]
  },
  {path: 'map', component: MapComponentComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
