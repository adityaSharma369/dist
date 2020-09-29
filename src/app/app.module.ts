import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {BrowserModule, Title} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {RoleGuard} from './shared/guards/role.guard';
import {AuthGuard} from './shared/guards/auth.guard';
import {NonAuthGuard} from './shared/guards/non-auth.guard';

import {CommonService} from './shared/services/common.service';
import {DataService} from './shared/services/data.service';
import {ApiService} from './shared/services/api.service';
import {AuthService} from './shared/services/auth.service';
import {ServerService} from './shared/services/server.service';
import {AlertService} from './shared/services/alert.service';
import {MenuItemsService} from './shared/services/menu-items.service';

import {SharedModule} from './shared/shared.module';

import {AppLayoutComponent} from './layouts/app-layout/app-layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {TwilioService} from './shared/services/twilio.service';
import {RoomComponent} from './room/room.component';
import {SocketService} from './shared/services/socket.service';
import { SpaceCreateComponent } from './space/space-create/space-create.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AuthLayoutComponent,
    DashboardComponent,
    RoomComponent,
    SpaceCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    // App Services
    AuthService,
    DataService,
    CommonService,
    ServerService,
    ApiService,
    AlertService,
    MenuItemsService,
    TwilioService,
    SocketService,
    // WebSocketsService,

    // Route Guards
    AuthGuard,
    NonAuthGuard,
    RoleGuard,

    // Angular
    Title,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
