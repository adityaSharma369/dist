import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonService} from '../../../shared/services/common.service';
import {TsDataListOptions, TsDataListWrapperClass} from '../../../shared/classes/ts-data-list-wrapper.class';
import {FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ts-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild('actionItemAddTemplate', {static: true}) actionItemAddTemplate: TemplateRef<any>;
  @ViewChild('actionItemEditTemplate', {static: true}) actionItemEditTemplate: TemplateRef<any>;
  actionItemTemplateModal;
  userList: TsDataListWrapperClass;
  actionItemAddForm: FormGroup;
  actionItemEditForm: FormGroup;
  disableActionButtons = false;

  constructor(public _common: CommonService) {
    this.actionItemAddForm = this._common._fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      role: ['user', Validators.required],
    });
    this.actionItemEditForm = this._common._fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      role: ['', Validators.required],
      _id: ['']
    });
  }

  ngOnInit() {
    // config
    const options = new TsDataListOptions({
      webMatColumns: ['email', 'first_name', 'phone', 'role', 'is_active', 'updated_at', 'actions'],
      mobileMatColumns: ['first_name', 'phone', 'role', 'actions'],
      actionButtons: [
        {icon: 'edit', showInMobile: true, color: 'accent', text: 'edit', callback: 'openAddEditItem'},
        {icon: 'delete', showInMobile: true, text: 'delete', callback: 'confirmDelete', color: 'warn'}
      ]
    }, this._common._api.apiUrl + '/user/list', this._common._api, 'post', this._common._mobileQuery);

    this.userList = new TsDataListWrapperClass(options);
  }

  public _runInAngular(task, item) {
    this._common._zone.runTask(() => {
      this[task](item);
    });
  }

  openAddEditItem(itemData = null) {
    let temp = this.actionItemAddTemplate;
    if (itemData) {
      this.actionItemEditForm.reset();
      this.actionItemEditForm.patchValue(itemData);
      temp = this.actionItemEditTemplate;
    } else {
      this.actionItemAddForm.reset();
    }

    this.actionItemTemplateModal = this._common._openDialog(temp);
  }

  itemAdd() {
    this.disableActionButtons = true;
    const payload = {...this.actionItemAddForm.value, ignoreErrors: true};
    this._common._api.post(this._common._api.apiUrl + '/user/add', payload).subscribe((resp) => {
      this.disableActionButtons = false;
      if (resp && resp.success) {
        this._common._closeDialog();
        this._common._alert.showAlert(resp.msg, 'success', 'Added');
        this.userList.reload(1);
        this.actionItemAddForm.reset();
      } else {
        this._common._alert.showAlert(resp.error, 'error');
      }
    }, (err) => {
      // console.log(err.errors);
      this._common.showFormValidationErrors(err, this.actionItemAddForm);
      this.disableActionButtons = false;
    });
  }

  itemEdit() {
    this.disableActionButtons = true;
    const payload = {...this.actionItemEditForm.value, ignoreErrors: true};
    payload.user_id = payload._id;
    delete payload._id;
    this._common._api.post(this._common._api.apiUrl + '/user/edit', payload).subscribe((resp) => {
      this.disableActionButtons = false;
      if (resp && resp.success) {
        this._common._closeDialog();
        this._common._alert.showAlert(resp.msg, 'success', 'Updated');
        this.userList.reload();
        this.actionItemEditForm.reset();
      } else {
        this._common._alert.showAlert(resp.error, 'error');
      }
    }, (err) => {
      this._common.showFormValidationErrors(err, this.actionItemEditForm);
      this.disableActionButtons = false;
    });
  }

  confirmDelete(item) {
    this._common._confirm.ask().then(() => {
      // on confirmed
      this.deleteItem(item);
    }).catch(() => {
      // if not confirmed
    });
  }

  deleteItem(item) {
    this.disableActionButtons = true;
    const payload = {user_id: item._id};
    this._common._api.post(this._common._api.apiUrl + '/user/delete', payload).subscribe((resp) => {
      this.disableActionButtons = false;
      if (resp && resp.success) {
        this._common._alert.showAlert(resp.msg, 'success', 'Deleted');
      } else {
        this._common._alert.showAlert(resp.error, 'error');
      }
      this.userList.reload(1);
    }, () => {
      this.disableActionButtons = false;
    });
  }
}
