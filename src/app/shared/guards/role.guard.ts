import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CommonService} from '../services/common.service';
import {Observable} from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private _common: CommonService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // console.log(route.data.roles, route.data.roles.indexOf(this._common._auth.user.role), this._common._auth.user.role);
    if (route.data.roles.indexOf(this._common._auth.user.role) > -1) {
      return true;
    }
    this._common._router.navigateByUrl('/');
    return false;
  }
}
