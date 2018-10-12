import {SelectionMode, ColumnResizeMode, EditMode} from './types';
import {TemplateRef} from '@angular/core';

export class Settings {
  tableWidth?: number;
  bodyHeight?: number;
  sortable?: boolean = true;
  filter?: boolean = true;
  clientSide?: boolean = true;
  multipleSort?: boolean;
  trackByProp?: string;
  groupRowsBy?: string[];
  clearAllFiltersIcon?: boolean = true;
  columnResizeMode?: ColumnResizeMode;
  selectionMultiple?: boolean;
  selectionMode?: SelectionMode;
  virtualScroll?: boolean;
  rowClass?: string | Function;
  headerTemplate?: TemplateRef<any>;
  headerRowHeight?: number;
  rowHeight?: number = 30;
  rowNumber?: boolean = true;
  hoverEvents?: boolean;
  contextMenu?: boolean;
  editMode?: EditMode;
  actionColumnWidth?: number = 40;
  rowActionTemplate?: TemplateRef<any>;
  paginator?: boolean = true;
  rowHeightProp?: string;

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
