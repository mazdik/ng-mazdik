import {Component, OnInit, Input, Output, EventEmitter, Renderer, AfterViewInit, OnDestroy} from '@angular/core';
import {Column, MenuItem} from '../types/interfaces';

@Component({
  selector: 'datatable-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public columns: Column[];
  @Input() public items: any;
  @Input() public enableAction: boolean;
  @Input() public actionColumnWidth: number;
  @Input() public actionMenu: MenuItem[];
  @Input() offsetX: number;

  @Output() onEditComplete: EventEmitter<any> = new EventEmitter();

  @Input() public selectedRowIndex: number;
  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();
  @Output() scroll: EventEmitter<any> = new EventEmitter();

  public editingCell: any;
  public editorClick: boolean;
  public documentClickListener: Function;
  public editable: boolean = false;

  offsetY: number = 0;
  frozenColumns: Column[] = [];
  scrollableColumns: Column[] = [];

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
      let d = new Date(value * 1000);
      value = d.toLocaleString('ru');
    }
    return value;
  }

  findCell(event) {
    let cell = event.target;
    while (cell.tagName !== 'DIV') {
      cell = cell.parentElement;
    }
    return cell;
  }

  switchCellToEditMode(event: any, column: Column) {
    if (column.editable) {
      this.editorClick = true;
      let cell = this.findCell(event);
      if (cell != this.editingCell) {
        if (this.editingCell) {
          this.renderer.setElementClass(this.editingCell, "cell-editing", false);
        }
        this.renderer.setElementClass(cell, "cell-editing", true);
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
    let cell = this.findCell(event);
    this.renderer.setElementClass(cell, "cell-editing", false);
  }

  closeCell() {
    if (this.editingCell) {
      this.renderer.setElementClass(this.editingCell, "cell-editing", false);
      this.editingCell = null;
    }
  }

  onCellEditorKeydown(event: any, column: Column, item: any, colIndex: number) {
    //enter
    if (event.keyCode == 13) {
      this.onEditComplete.emit(item);
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode(event);
      event.preventDefault();
    }
    //escape
    else if (event.keyCode == 27) {
      //this.onEditCancel.emit({column: column, data: rowData});
      this.renderer.invokeElementMethod(event.target, 'blur');
      this.switchCellToViewMode(event);
      event.preventDefault();
    }
    //tab
    else if (event.keyCode == 9) {
      let currentCell = this.findCell(event);
      let row = currentCell.parentElement;
      let targetCell;

      if (event.shiftKey) {
        if (colIndex == 0) {
          let previousRow = row.previousElementSibling;
          if (previousRow) {
            targetCell = previousRow.lastElementChild;
          }
        }
        else {
          targetCell = row.children[colIndex - 1];
        }
      }
      else {
        if (colIndex == (row.children.length - 1)) {
          let nextRow = row.nextElementSibling;
          if (nextRow) {
            targetCell = nextRow.firstElementChild;
          }
        }
        else {
          targetCell = row.children[colIndex + 1];
        }
      }

      if (targetCell) {
        this.renderer.invokeElementMethod(targetCell, 'click');
        event.preventDefault();
      }
    }
  }

  rowClick(event: any, rowIndex: number) {
    this.selectedRowIndex = rowIndex;
    this.selectedRowIndexChange.emit(this.selectedRowIndex);
  }

  getOptions(column: Column, item: any) {
    if (column.options) {
      if (column.dependsColumn) {
        return column.options.filter((value) => value.parentId == item[column.dependsColumn]);
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

  onBodyScroll(event: any): void {
    const scrollYPos: number = event.scrollYPos;
    const scrollXPos: number = event.scrollXPos;

    // if scroll change, trigger update
    // this is mainly used for header cell positions
    if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
      this.scroll.emit({
        offsetY: scrollYPos,
        offsetX: scrollXPos
      });
    }

    this.offsetY = scrollYPos;
    this.offsetX = scrollXPos;

/*    this.updateIndexes();
    this.updatePage(event.direction);
    this.updateRows();*/
  }

  stylesByGroup() {
    let styles: any = {};
    styles.left = `${this.offsetX}px`;
    return styles;
  }

}
