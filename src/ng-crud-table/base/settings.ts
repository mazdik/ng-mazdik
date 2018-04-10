import {SelectionType, SelectionMode, ColumnResizeMode} from '../types';
import {TemplateRef} from '@angular/core';

export class Settings {
  public api?: string;
  public crud?: boolean;
  public primaryKeys?: string[];
  public tableWidth?: number;
  public bodyHeight?: number;
  public sortable?: boolean = true;
  public filter?: boolean = true;
  public initLoad?: boolean = true;
  public clientSide?: boolean = true;
  public multipleSort?: boolean;
  public trackByProp?: string;
  public groupRowsBy?: string[];
  public filterDelay?: number = 500;
  public globalFilter?: boolean;
  public columnResizeMode?: ColumnResizeMode = 'simple';
  public selectionType?: SelectionType;
  public selectionMode?: SelectionMode;
  public singleRowView?: boolean = true;
  public virtualScroll?: boolean;
  public rowClass?: string | Function;
  public headerTemplate?: TemplateRef<any>;
  public headerRowHeight?: number = 40;
  public rowHeight?: number = 30;
  public rowNumber?: boolean = true;
  public zIndexModal?: number;

  constructor(init: Partial<Settings>) {
    if (init) {
      Object.assign(this, init);
    }
  }

}
