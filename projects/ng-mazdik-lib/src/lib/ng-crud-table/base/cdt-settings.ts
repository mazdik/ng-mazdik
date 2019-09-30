import {Settings} from '../../ng-data-table/base/settings';

export class CdtSettings extends Settings {
  crud?: boolean;
  initLoad?: boolean = true;
  globalFilter?: boolean;
  singleRowView?: boolean = true;
  zIndexModal?: number;
  exportAction?: boolean;
  columnToggleAction?: boolean;
  clearAllFiltersAction?: boolean;
  clearAllFiltersIcon?: boolean = true;

  constructor(init: Partial<CdtSettings>) {
    super(init);
    Object.assign(this, init);
  }

}
