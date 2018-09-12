import {SelectionMode, ColumnResizeMode, EditMode} from './types';
import {TemplateRef} from '@angular/core';

export class Settings {
  api?: string;
  crud?: boolean;
  tableWidth?: number;
  bodyHeight?: number;
  sortable?: boolean = true;
  filter?: boolean = true;
  initLoad?: boolean = true;
  clientSide?: boolean = true;
  multipleSort?: boolean;
  trackByProp?: string;
  groupRowsBy?: string[];
  filterDelay?: number = 500;
  globalFilter?: boolean;
  columnResizeMode?: ColumnResizeMode;
  selectionMultiple?: boolean;
  selectionMode?: SelectionMode;
  singleRowView?: boolean = true;
  virtualScroll?: boolean;
  rowClass?: string | Function;
  headerTemplate?: TemplateRef<any>;
  headerRowHeight?: number = 40;
  rowHeight?: number = 30;
  rowNumber?: boolean = true;
  zIndexModal?: number;
  hoverEvents?: boolean;
  contextMenu?: boolean;
  exportAction?: boolean;
  editMode?: EditMode;
  actionColumnWidth?: number = 40;
  rowActionTemplate?: TemplateRef<any>;

  constructor(init: Partial<Settings>) {
    if (init) {
      Object.assign(this, init);
    }
    if (!this.columnResizeMode) {
      this.columnResizeMode = ColumnResizeMode.Simple;
    }
    if (!this.editMode) {
      this.editMode = EditMode.EditCellOnDblClick;
    }
  }

}
