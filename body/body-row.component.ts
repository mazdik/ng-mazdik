import {Component, OnInit, Input, Output, EventEmitter, Renderer, AfterViewInit, OnDestroy} from '@angular/core';
import {Column, MenuItem} from '../types/interfaces';

@Component({
  selector: 'datatable-body-row',
  templateUrl: './body-row.component.html',
  styleUrls: ['./body-row.component.css']
})
export class BodyRowComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public columns: Column[];
  @Input() public row: any;
  @Input() public enableAction: boolean;
  @Input() public actionColumnWidth: number;
  @Input() public actionMenu: MenuItem[];
  @Input() public offsetX: number;
  @Input() public selectedRowIndex: number;
  @Input() public rowIndex: number;

  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();

  public editingCell: any;
  public editorClick: boolean;
  public documentClickListener: Function;
  public editable: boolean = false;
  public frozenColumns: Column[] = [];
  public scrollableColumns: Column[] = [];

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    if (this.columns) {
      this.columns.forEach((column) => {
        if (column.editable) {
          this.editable = true;
        }
        if (column.frozen) {
          this.frozenColumns.push(column);
        } else {
          this.scrollableColumns.push(column);
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.editable) {
      this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
        if (!this.editorClick) {
          this.closeCell();
        }
        this.editorClick = false;
      });
    }
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }

  format(value: any, column: Column) {
    if (column.format && column.format === 'date') {
      const d = new Date(value * 1000);
      value = d.toLocaleString('ru');
    }
    return value;
  }

  findCell(event) {
    let cell = event.target;
    while (cell.classList.contains('datatable-body-cell') === false) {
      cell = cell.parentElement;
    }
    return cell;
  }

  switchCellToEditMode(event: any, column: Column) {
    if (column.editable) {
      this.editorClick = true;
      const cell = this.findCell(event);
      if (cell !== this.editingCell) {
        if (this.editingCell) {
          this.renderer.setElementClass(this.editingCell, 'cell-editing', false);
        }
        this.renderer.setElementClass(cell, 'cell-editing', true);
        this.editingCell = cell;
        let focusable;
        if (column.options) {
          focusable = cell.querySelector('.cell-editor select');
        } else {
          focusable = cell.querySelector('.cell-editor input');
        }
        if (focusable) {
          setTimeout(() => this.renderer.invokeElementMethod(focusable, 'focus'), 50);
        }
      }
    }
  }

  switchCellToViewMode(event: any) {
    this.editingCell = null;
    const cell = this.findCell(event);
    this.renderer.setElementClass(cell, 'cell-editing', false);
  }

  closeCell() {
    if (this.editingCell) {
      this.renderer.setElementClass(this.editingCell, 'cell-editing', false);
      this.editingCell = null;
    }
  }

  onCellEditorKeydown(event: any, column: Column, item: any, colIndex: number) {
    // enter
    if (event.keyCode === 13) {
      this.editComplete.emit(item);
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode(event);
      event.preventDefault();
      // escape
    } else if (event.keyCode === 27) {
      // this.onEditCancel.emit({column: column, data: rowData});
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode(event);
      event.preventDefault();
      // tab
    } else if (event.keyCode === 9) {
      const currentCell = this.findCell(event);
      const row = currentCell.parentElement;
      let targetCell;

      if (event.shiftKey) {
        if (colIndex === 0) {
          const previousRow = row.previousElementSibling;
          if (previousRow) {
            targetCell = previousRow.lastElementChild;
          }
        } else {
          targetCell = row.children[colIndex - 1];
        }
      } else {
        if (colIndex === (row.children.length - 1)) {
          const nextRow = row.nextElementSibling;
          if (nextRow) {
            targetCell = nextRow.firstElementChild;
          }
        } else {
          targetCell = row.children[colIndex + 1];
        }
      }

      if (targetCell) {
        this.renderer.invokeElementMethod(targetCell, 'click');
        event.preventDefault();
      }
    }
  }

  rowClick(rowIndex: number) {
    this.selectedRowIndex = rowIndex;
    this.selectedRowIndexChange.emit(this.selectedRowIndex);
  }

  getOptions(column: Column, item: any) {
    if (column.options) {
      if (column.dependsColumn) {
        return column.options.filter((value) => value.parentId === item[column.dependsColumn]);
      } else {
        return column.options;
      }
    }
  }

  actionClick(event, item: MenuItem, rowIndex: number) {
    this.selectedRowIndex = rowIndex;
    this.selectedRowIndexChange.emit(this.selectedRowIndex);

    if (!item.url) {
      event.preventDefault();
    }

    if (item.command) {
      if (!item.eventEmitter) {
        item.eventEmitter = new EventEmitter();
        item.eventEmitter.subscribe(item.command);
      }

      item.eventEmitter.emit({
        originalEvent: event,
        item: item
      });
    }
  }

  stylesByGroup() {
    const styles: any = {};
    styles.left = `${this.offsetX}px`;
    return styles;
  }

}
