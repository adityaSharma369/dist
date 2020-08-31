import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  token: string;
  // aclModules = [];

  constructor() {
    const user = window.localStorage.getItem('currentUser');
    try {
      this.user = JSON.parse(user);
    } catch (e) {
      this.user = null;
    }
    this.token = window.localStorage.getItem('token');
  }

  public getToken(): string {
    return window.localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  afterLogin(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    this.token = data.token;
    this.user = data.user;
    // this.aclModules = data.modules;
  }

  // isManager() {
  //   return this.user.role === 'manager';
  // }
  //
  // isDataScientist() {
  //   return this.user.role === 'datascientist';
  // }
  //
  // isAnnotator() {
  //   return this.user.role === 'annotator';
  // }
  //
  // isAdmin() {
  //   return this.user.role === 'admin';
  // }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    delete this.user;
    delete this.token;
  }
}
