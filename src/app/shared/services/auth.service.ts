import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  token: string;

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

  public getTempUserId(): string {
    return window.localStorage.getItem('tmp_user_id');
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  afterLogin(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    this.token = data.token;
    this.user = data.user;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('temp_user_id');
    delete this.user;
    delete this.token;
  }
}
