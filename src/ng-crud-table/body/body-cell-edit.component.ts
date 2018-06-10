import {
  Component, ElementRef, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import {Column} from '../base/column';
import {BodyCellComponent} from './body-cell.component';
import {Row, CellEventArgs} from '../types';
import {Keys} from '../base/keys';

@Component({
  selector: 'app-datatable-body-cell-edit',
  templateUrl: './body-cell-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellEditComponent extends BodyCellComponent implements OnInit {

  constructor(cd: ChangeDetectorRef, element: ElementRef) {
    super(cd, element);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const subClickCell = this.table.events.clickCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.index === ev.rowIndex && this.column.index === ev.columnIndex) {
        this.switchCellToEditMode();
      }
    });
    const subKeydownCell = this.table.events.keydownCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.index === ev.rowIndex && this.column.index === ev.columnIndex) {
        this.onCellKeydown(ev.event);
      }
    });
    this.subscriptions.push(subClickCell);
    this.subscriptions.push(subKeydownCell);
  }

  switchCellToEditMode() {
    if (this.column.editable) {
      this.editing = true;
      this.cd.markForCheck();
    }
  }

  switchCellToViewMode() {
    this.editing = false;
    if (this.row[this.column.name] !== this.oldValue) {
      this.updateValue();
    }
  }

  onCellKeydown(event: any) {
    if (this.editing) {
      this.onCellEditorKeydown(event);
    } else {
      if (event.keyCode === Keys.KEY_F2 || event.keyCode === Keys.ENTER) {
        this.switchCellToEditMode();
      }
    }
  }

  onCellEditorKeydown(event: any) {
    if (event.keyCode === Keys.ENTER) {
      this.table.events.onEdit(this.row);
      this.switchCellToViewMode();
      this.element.nativeElement.focus();
    } else if (event.keyCode === Keys.ESCAPE) {
      this.editing = false;
      this.row[this.column.name] = this.oldValue;
      this.updateValue();
      this.element.nativeElement.focus();
    }
    event.preventDefault();
    event.stopPropagation();
  }

  getOptions(row: Row[]) {
    return this.column.getOptions(row[this.column.dependsColumn]);
  }

}
