import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {CommonService} from '../../shared/services/common.service';
import {NavigationStart} from '@angular/router';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'ts-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public _common: CommonService) {
    this._common._mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this._common._mobileQuery.addEventListener('change', this._mobileQueryListener);
    this._common._router.events.subscribe((event: NavigationStart) => {
      if (this._common._mobileQuery.matches) {
        this.sidenav.close();
      }
    });
  }

  ngOnInit(): void {

  }

  toggleSideNav() {
    this.sidenav.toggle();
  }

  ngOnDestroy(): void {
    this._common._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  logout() {
    this._common._api.post(this._common._api.apiUrl + '/account/logout', {}).subscribe((resp) => {
      // logged out on server
    });
    this._common._auth.logout();
    this._common._router.navigateByUrl('/login');
  }
}
