import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pagination} from '../../classes/ts-data-list-wrapper.class';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-mat-pagination',
  templateUrl: './ts-mat-pagination.component.html',
  styleUrls: ['./ts-mat-pagination.component.scss']
})
export class TsMatPaginationComponent implements OnInit {
  @Input() pagination: Pagination = new Pagination();
  @Output() goToPage: EventEmitter<any> = new EventEmitter();
  @Input() showFirstLastButtons = true;
  @Input() hidePageSize = false;
  @Input() color;
  @Input() disabled = false;
  @Input() alwaysShow = false;

  constructor() {
  }

  ngOnInit() {
  }

  getPages(): number {
    return Math.ceil(this.pagination.totalItems / this.pagination.pageSize);
  }

  pageEvent(e) {
    this.goToPage.emit({page: e.pageIndex + 1, limit: e.pageSize});
  }
}
