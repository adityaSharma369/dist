import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AppInnerRoutingModule} from './app-inner-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppInnerRoutingModule,
    SharedModule
  ]
})
export class AppInnerModule {
}
