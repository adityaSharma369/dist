import {ApiService} from '../services/api.service';

export class Pagination {
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];

  constructor() {
  }
}

export interface ActionItem {
  icon: string;
  text: string;
  callback: any;
  showInMobile: boolean;
  color: string;
}

export interface DataListConfig {
  _isDataLoading: boolean;
  _isDataLoaded: boolean;
  data: any[];
  matColumns: string[];
  webMatColumns: string[];
  mobileMatColumns: string[];
  filter: object;
  sort: object;
  extraPayload: object;
  pagination: Pagination;
  actionButtons: ActionItem[];
}

export class TsDataListOptions {
  _isDataLoading = false;
  _isDataLoaded = false;
  data = [];
  matColumns = [];
  webMatColumns = [];
  mobileMatColumns = [];
  extraPayload: any = {};
  filter: any = {search: ''};
  pagination = new Pagination();
  _mobileQuery: MediaQueryList = null;
  actionButtons: ActionItem[] = [];

  constructor(config: DataListConfig | any,
              public url: string,
              public _apiService: ApiService,
              public method = 'post',
              _mobileQuery: MediaQueryList = null) {
    if (config) {
      if (config.matColumns) {
        this.matColumns = config.matColumns;
        this.webMatColumns = config.matColumns;
        this.mobileMatColumns = config.matColumns;
      } else {
        if (config.webMatColumns) {
          this.webMatColumns = config.webMatColumns;
          this.matColumns = config.webMatColumns;
          this.mobileMatColumns = config.webMatColumns;
        }
        if (config.mobileMatColumns) {
          this.mobileMatColumns = config.mobileMatColumns;
        }
      }
      if (config.extraPayload) {
        this.extraPayload = config.extraPayload;
      }
      if (config.actionButtons) {
        this.actionButtons = config.actionButtons;
      }
      if (config.filter) {
        this.filter = config.filter;
      }
      if (config.pagination) {
        this.pagination = {...this.pagination, ...config.pagination};
      }
      if (_mobileQuery) {
        this._mobileQuery = _mobileQuery;
      }
    }
  }
}

export class TsDataListWrapperClass {
  _isDataLoading = false;
  _isDataLoaded = false;
  data = [];
  matColumns = [];
  webMatColumns = [];
  mobileMatColumns = [];
  filter: any = {};
  sort: any = {};
  extraPayload: any = {};
  pagination: Pagination = new Pagination();
  _apiService: ApiService;
  url = '';
  method = 'post';
  actionButtons: ActionItem[] = [];
  _apiCall;

  constructor(options: TsDataListOptions) {
    this._isDataLoading = options._isDataLoading;
    this._isDataLoaded = options._isDataLoaded;
    this.data = options.data;
    this.matColumns = options.matColumns;
    this.webMatColumns = options.webMatColumns;
    this.mobileMatColumns = options.mobileMatColumns;
    this.filter = options.filter;
    this.extraPayload = options.extraPayload;
    this.pagination = options.pagination;
    this._apiService = options._apiService;
    this.url = options.url;
    this.method = options.method;
    this.actionButtons = options.actionButtons;
    this.getList();
    if (options._mobileQuery) {
      this.updateColumnShow(options._mobileQuery.matches);
      options._mobileQuery.addEventListener('change', (e) => {
        this.updateColumnShow(e.matches);
      });
    } else {
      this.showWebList();
    }
  }

  updateColumnShow(isMobile) {
    if (isMobile) {
      this.showMobileList();
    } else {
      this.showWebList();
    }
  }

  showMobileList() {
    this.matColumns = this.mobileMatColumns;
  }

  showWebList() {
    this.matColumns = this.webMatColumns;
  }

  reload(page = (this.pagination.pageIndex + 1)) {
    this.getList(page);
  }

  canShowTable() {
    return (this._isDataLoaded && this.data && this.data.length > 0);
  }

  canShowNoData() {
    return (!this._isDataLoading && this._isDataLoaded && (!this.data || this.data.length === 0));
  }

  pageEvent(e: { page: number, limit: number }) {
    this.getList(e.page, e.limit);
  }

  getList(page = 1, limit = this.pagination.pageSize) {
    this._isDataLoading = true;
    const payload = {...this.filter, ...this.extraPayload, page, limit, sort: this.sort};
    let request = this._apiService.post(this.url, payload);
    if (this.method === 'get') {
      request = this._apiService.get(this.url, payload);
    }
    if (this._apiCall) {
      this._apiCall.unsubscribe();
    }
    this._apiCall = request.subscribe(
      (response: any) => {
        this._isDataLoading = false;
        this._isDataLoaded = true;
        if (response && response.success) {
          this.data = response.data.docs || [];
          this.pagination.totalItems = response.data.total || 0;
          this.pagination.pageSize = response.data.limit || limit;
          this.pagination.pageIndex = (response.data.current_page || page) - 1;
        } else {
          this.data = [];
          this.pagination.totalItems = 0;
          this.pagination.pageSize = limit;
          this.pagination.pageIndex = page - 1;
        }
      }, (err) => {
        this.data = [];
        this._isDataLoaded = true;
        this._isDataLoading = false;
        this.data = [];
        this.pagination.totalItems = 0;
        this.pagination.pageSize = limit;
        this.pagination.pageIndex = page - 1;
      });
  }

  sortList($event: any) {
    this.sort = {};
    this.sort[$event.active] = $event.direction;
    this.getList(1);
  }

}
