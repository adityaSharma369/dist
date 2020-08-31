import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

import {catchError, map, timeoutWith} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import * as JQuery from 'jquery';
import {AuthService} from './auth.service';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl;
  defaultTimeoutMilliseconds = 1000 * 60 * 60 * 24; // one day

  constructor(private _auth: AuthService, private _alert: AlertService, private _http: HttpClient, private _router: Router) {
    this.apiUrl = environment.api_url;
    // const domainHost = window.location.hostname;
    // switch (domainHost) {
    //   case 'dev.teric.ai':
    //     this.apiUrl = environment.dev_api_url;
    //     break;
    //   case 'teric.ai':
    //     this.apiUrl = environment.api_url;
    //     break;
    //   case 'www.teric.ai':
    //     this.apiUrl = environment.api_url;
    //     break;
    // }
  }

  private getOptions(overrideHeaders = {}, overrideOptions = {}) {
    const commonHeaders = {
      Authorization: 'Bearer ' + this._auth.token,
      'Content-Type': 'application/json'
    };
    const commonOptions: any = {observe: 'response'};
    commonOptions.headers = {...commonHeaders, ...overrideHeaders};
    return {...commonOptions, ...overrideOptions};
  }

  public post(url, data, headers = {}, options = {}): Observable<any> {
    const ignoreErrors = data.ignoreErrors || false;
    delete data.ignoreErrors;
    const timeoutSeconds = data.timeoutSeconds || this.defaultTimeoutMilliseconds;
    delete data.timeoutSeconds;
    options = this.getOptions(headers, options);
    return this._http.post(url, data, options).pipe(
      timeoutWith(timeoutSeconds, this.handleTimeout(timeoutSeconds)),
      map((response: any) => {
        return response.body;
      }), catchError((err: any) => {
        if (!ignoreErrors) {
          this.handleErrors(err);
        }
        return throwError(err.error);
      }));
  }

  public upload(url, data: any = {}, headers = {}, options = {}): Observable<any> {
    const ignoreErrors = data.ignoreErrors || false;
    delete data.ignoreErrors;
    const timeoutSeconds = data.timeoutSeconds || this.defaultTimeoutMilliseconds;
    delete data.timeoutSeconds;
    options = this.getOptions(headers, options);
    return this._http.post(url, data, options).pipe(
      timeoutWith(timeoutSeconds, this.handleTimeout(timeoutSeconds)),
      map((response: any) => {
        return response;
      }), catchError((err: any) => {
        if (!ignoreErrors) {
          this.handleErrors(err);
        }
        return throwError(err.error);
      }));
  }

  public get(url, data: any = {}, headers = {}, options = {}): Observable<any> {
    const ignoreErrors = data.ignoreErrors || false;
    delete data.ignoreErrors;
    const timeoutSeconds = data.timeoutSeconds || this.defaultTimeoutMilliseconds;
    delete data.timeoutSeconds;
    options = this.getOptions(headers, options);
    url = this.prepareParams(url, data);
    return this._http.get(url, options).pipe(
      timeoutWith(timeoutSeconds, this.handleTimeout(timeoutSeconds)),
      map((response: any) => {
        return response.body;
      }), catchError((err: any) => {
        if (!ignoreErrors) {
          this.handleErrors(err);
        }
        return throwError(err.error);
      }));
  }

  public put(url, data: any = {}, headers = {}, options = {}): Observable<any> {
    const ignoreErrors = data.ignoreErrors || false;
    delete data.ignoreErrors;
    const timeoutSeconds = data.timeoutSeconds || this.defaultTimeoutMilliseconds;
    delete data.timeoutSeconds;
    options = this.getOptions(headers, options);
    return this._http.put(url, data, options).pipe(
      timeoutWith(timeoutSeconds, this.handleTimeout(timeoutSeconds)),
      map((response: any) => {
        return response.body;
      }), catchError((err: any) => {
        if (!ignoreErrors) {
          this.handleErrors(err);
        }
        return throwError(err.error);
      }));
  }

  public delete(url, data: any = {}, headers = {}, options = {}): Observable<any> {
    const ignoreErrors = data.ignoreErrors || false;
    delete data.ignoreErrors;
    const timeoutSeconds = data.timeoutSeconds || this.defaultTimeoutMilliseconds;
    delete data.timeoutSeconds;
    options = this.getOptions(headers, options);
    url = this.prepareParams(url, data);
    return this._http.delete(url, options).pipe(
      timeoutWith(timeoutSeconds, this.handleTimeout(timeoutSeconds)),
      map((response: any) => {
        return response.body;
      }), catchError((err: any) => {
        if (!ignoreErrors) {
          this.handleErrors(err);
        }
        return throwError(err.error);
      }));
  }

  prepareParams(url, data): string {
    if (data.toString().length === 2 || data.toString() === '[object Object]') {
      return url;
    }
    const params = JQuery.param(data);
    if (url.indexOf('?') !== -1) {
      url += +'&' + params;
    } else {
      url += '?' + params;
    }
    return url;
  }

  private handleTimeout(timeoutSeconds) {
    return throwError({error: {success: false, error: 'timeout', onClient: true, timeoutSeconds}, status: 408});
  }

  private handleErrors(err: any) {
    console.log(err);
    const data = err.error;
    if (data.errors) {
      for (const error in data.errors) {
        if (data.errors.hasOwnProperty(error)) {
          this._alert.showAlert(data.errors[error], 'error');
        }
      }
    } else {
      if ((data.error && data.error !== '') || (data.msg && data.msg !== '')) {
        this._alert.showAlert(data.error || data.msg, 'error');
      } else {
        this._alert.showAlert('Oops... Something went wrong!', 'error');
      }
    }
    if (err.status === 401) { // unauthorized
      this._auth.logout();
      this._router.navigateByUrl('/login', {queryParams: {returnUrl: this._router.url}});
    }
  }
}

