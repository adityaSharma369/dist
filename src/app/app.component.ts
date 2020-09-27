import {Component, ElementRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterEvent} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {NetworkStatusAngularService} from 'network-status-angular';
import {CommonService} from './shared/services/common.service';
import {ServerService} from './shared/services/server.service';

@Component({
  selector: 'ts-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Zappy.live';
  @ViewChild('loadingElement', {static: true}) loadingElement: ElementRef;

  constructor(private _network: NetworkStatusAngularService,
              private _common: CommonService,
              private _server: ServerService,
              private _title: Title,
              private _zone: NgZone,
              private _renderer: Renderer2) {

    // show loading when _showPageLoading triggers true or hide when false
    this._common._showPageLoading.subscribe((show: boolean) => {
      if (show === true) {
        this._zone.runOutsideAngular(() => {
          this._renderer.setStyle(this.loadingElement.nativeElement, 'display', 'block');
        });
      } else {
        this._zone.runOutsideAngular(() => {
          this._renderer.setStyle(this.loadingElement.nativeElement, 'display', 'none');
        });
      }
    });
    // track network change and find if app is online or not
    this._network.status.subscribe(status => {
      // console.log(status); // returns true if it is online or false if it is offline
      this._common._data.isAppOnline = status;
      // this._common._alert.showAlert('Network status changed ' + (status) ? 'Online' : 'Offline', 'info');
    });
    // this._server.checkLogin((resp) => {
    //   if (resp && resp.success) {
    //   }
    // });

    // track app navigation changes
    this._common._router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this._common._showPageLoading.next(true);
      }
      if (event instanceof NavigationEnd) {
        // updating page title when navigation completes (title is updated in data.pageTitle)
        this._title.setTitle(this._common._data.pageTitle || this.title);
        this._common._data.pageTitle = '';
        this._common._showPageLoading.next(false);
        // gtag('config', 'UA-147955742-1', {'page_path': event.urlAfterRedirects});
      }
      if (event instanceof NavigationCancel) {
        this._common._showPageLoading.next(false);
      }
      if (event instanceof NavigationError) {
        this._common._showPageLoading.next(false);
      }
    });

  }
}
