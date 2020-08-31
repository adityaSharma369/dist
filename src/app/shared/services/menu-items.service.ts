import {Injectable} from '@angular/core';
import {CommonService} from './common.service';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  allowed_roles?: Array<any>;
  modules?: Array<any>;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: '/dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
    allowed_roles: ['user'],
    modules: ['dashboard']
  },
  {
    state: '/user/list',
    name: 'Users',
    type: 'link',
    icon: 'person',
    allowed_roles: [],
    modules: ['user']
  }
];

@Injectable()
export class MenuItemsService {

  constructor(private _common: CommonService) {
  }

  getAll(): Menu[] {
    return MENUITEMS;
    // return MENUITEMS.filter((menuitem) => {
    //   if (menuitem.allowed_roles.indexOf(this._common._auth.user.role) > -1) {
    //     return menuitem;
    //   } else {
    //     return;
    //   }
    // });


    // return MENUITEMS.filter((menuitem) => {
    //   if (this._common._auth.isAnnotator()) {
    //     if (menuitem.name === 'Assigned Tasks') {
    //       return menuitem;
    //     }
    //   } else if (this._common._auth.isDataScientist()) {
    //     if (menuitem.name !== 'Annotation Requests' && menuitem.name !== 'Users' &&
    //       menuitem.name !== 'Assigned Tasks' && menuitem.name !== 'Teams') {
    //       return menuitem;
    //     }
    //   } else {
    //     return menuitem;
    //   }

    // const has_access = menuitem.modules.filter(value => -1 !== Object.keys(this._common._auth.aclModules).indexOf(value));
    // if (has_access.length > 0) {
    //   return menuitem;
    // } else {
    //   return;
    // }
  }
}
