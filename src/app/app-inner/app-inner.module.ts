import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppInnerRoutingModule} from './app-inner-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    AppInnerRoutingModule,
    SharedModule
  ]
})
export class AppInnerModule {
}
