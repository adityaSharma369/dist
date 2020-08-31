import {Component, OnInit} from '@angular/core';
import {MenuItemsService} from '../../../../shared/services/menu-items.service';

@Component({
  selector: 'ts-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  providers: []
})
export class MenuItemsComponent implements OnInit {

  constructor(
    public menuService: MenuItemsService
  ) {
  }

  ngOnInit() {
  }

}
