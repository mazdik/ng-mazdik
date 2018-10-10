import {Settings} from '../../ng-data-table/base/settings';

export class CdtSettings extends Settings {
  crud?: boolean;
  initLoad?: boolean = true;
  globalFilter?: boolean;
  singleRowView?: boolean = true;
  zIndexModal?: number;
  exportAction?: boolean;

  constructor(init: Partial<CdtSettings>) {
    super(init);
    if (init) {
      Object.assign(this, init);
    }
  }

}
