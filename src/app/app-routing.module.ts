import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './not-found/not-found.component';
import {RoomComponent} from './room/room.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  // {
  //   path: '', component: AppLayoutComponent, canActivate: [AuthGuard], children: [
  //     {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  //     {path: 'dashboard', component: DashboardComponent},
  //     {path: '', loadChildren: () => import('./app-inner/app-inner.module').then(m => m.AppInnerModule)},
  //   ]
  // },
  // {
  //   path: '', component: AuthLayoutComponent, canActivate: [NonAuthGuard], children: [
  //     {path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  //   ]
  // },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'room/:roomId/:roomTitle', component: RoomComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
