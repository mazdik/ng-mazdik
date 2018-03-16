import {SelectionType, SelectionMode} from '../types';

export class Settings {
  public api?: string;
  public crud?: boolean;
  public primaryKeys?: string[];
  public tableWidth?: number;
  public scrollHeight?: number;
  public sortable?: boolean = true;
  public filter?: boolean = true;
  public initLoad?: boolean = true;
  public clientSide?: boolean = true;
  public multipleSort?: boolean;
  public trackByProp?: string;
  public groupRowsBy?: string[];
  public filterDelay?: number = 500;
  public globalFilter?: boolean;
  public setWidthColumnOnMove?: boolean;
  public selectionType?: SelectionType;
  public selectionMode?: SelectionMode;
  public singleRowView?: boolean = true;
  public virtualScroll?: boolean;

  constructor(init: Partial<Settings>) {
    if (init) {
      Object.assign(this, init);
    }
  }

}
