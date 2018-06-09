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
        this.cd.markForCheck();
      }
    });
    const subKeydownCell = this.table.events.keydownCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.index === ev.rowIndex && this.column.index === ev.columnIndex) {
        this.onCellEditorKeydown(ev.event);
      }
    });
    this.subscriptions.push(subClickCell);
    this.subscriptions.push(subKeydownCell);
  }

  switchCellToEditMode() {
    if (this.column.editable) {
      this.editing = true;
    }
  }

  switchCellToViewMode() {
    this.editing = false;
    if (this.row[this.column.name] !== this.oldValue) {
      this.updateValue();
    }
  }

  onCellEditorKeydown(event: any) {
    if (event.keyCode === Keys.ENTER) {
      this.table.events.onEdit(this.row);
      this.switchCellToViewMode();
      event.preventDefault();
    } else if (event.keyCode === Keys.ESCAPE) {
      this.editing = false;
      this.row[this.column.name] = this.oldValue;
      this.updateValue();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  getOptions(row: Row[]) {
    return this.column.getOptions(row[this.column.dependsColumn]);
  }


}
