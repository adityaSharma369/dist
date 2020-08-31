import {TsMultiSelectDropdownConfig} from './ts-multi-select-dropdown.module';
import {ApiService} from '../../services/api.service';

export class TsMultiSelectDropdownOptionsClass {
  config: TsMultiSelectDropdownConfig = {
    idField: '_id',
    textField: 'name',
    searchPlaceholderText: 'search',
    enableCheckAll: false,
    noDataAvailablePlaceholderText: 'no data available',
    extraPayload: {},
    searchKey: 'search',
    displayWith: (item) => {
      return (item && item.name) ? item.name : item;
    }
  };

  // options: TsMultiSelectDropdownOptions;

  constructor(config: TsMultiSelectDropdownConfig = {}, public _apiUrl: string, public _apiService: ApiService) {
    const defaultConfig = {...this.config, ...config};
    this.config = defaultConfig;
  }

}
