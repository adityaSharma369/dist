import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CommonService} from '../services/common.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _common: CommonService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this._common._auth.isAuthenticated()) {
      return true;
    } else {
      this._common._router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }
}
