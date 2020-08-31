import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../shared/services/common.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'ts-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl = '/';
  disableActionButtons = false;

  constructor(public _common: CommonService, private _route: ActivatedRoute) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    });
    this._route.queryParams.subscribe((params) => {
      this.returnUrl = params.returnUrl || '/';
    });
  }

  ngOnInit() {
  }

  login() {
    this.disableActionButtons = true;
    const payload = {...this.loginForm.value};
    this._common._api.post(this._common._api.apiUrl + '/account/login', payload).subscribe((resp: any) => {
      this.disableActionButtons = false;
      if (resp && resp.success) {
        this._common._auth.afterLogin(resp.data);
        this._common._router.navigateByUrl(this.returnUrl);
      }
    }, (err) => {
      this.disableActionButtons = false;
    });
  }
}
