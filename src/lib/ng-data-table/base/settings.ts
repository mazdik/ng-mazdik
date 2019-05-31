import {SelectionMode, EditMode} from './types';

type RowClassFunc = (row) => any;

export class Settings {
  bodyHeight?: number;
  sortable?: boolean = true;
  filter?: boolean = true;
  multipleSort?: boolean;
  trackByProp?: string;
  groupRowsBy?: string[];
  selectionMultiple?: boolean;
  selectionMode?: SelectionMode;
  virtualScroll?: boolean;
  rowClass?: string | RowClassFunc;
  headerRowHeight?: number;
  rowHeight?: number = 30;
  rowNumber?: boolean = true;
  hoverEvents?: boolean;
  contextMenu?: boolean;
  editMode?: EditMode;
  paginator?: boolean = true;
  rowHeightProp?: string;
  isEditableCellProp?: string;

  constructor(init: Partial<Settings>) {
    Object.assign(this, init);
    if (!this.editMode) {
      this.editMode = EditMode.EditCellOnDblClick;
    }
  }

}
