import {Component, ElementRef, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {BodyCellComponent} from './body-cell.component';
import {Row, CellEventArgs} from '../../types';
import {Keys, Constants} from '../../base';

@Component({
  selector: 'app-datatable-body-cell-edit',
  templateUrl: './body-cell-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellEditComponent extends BodyCellComponent implements OnInit {

  public tempValue: any;

  constructor(cd: ChangeDetectorRef, element: ElementRef) {
    super(cd, element);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const subDblClickCell = this.table.events.dblClickCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.index === ev.rowIndex && this.column.index === ev.columnIndex) {
        if (this.table.settings.editMode !== Constants.editProgrammatically) {
          this.switchCellToEditMode();
        }
      }
    });
    const subKeydownCell = this.table.events.keydownCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.index === ev.rowIndex && this.column.index === ev.columnIndex) {
        if (this.table.settings.editMode !== Constants.editProgrammatically) {
          this.onCellKeydown(ev.event);
        }
      }
    });
    const subCellEditMode = this.table.events.cellEditModeSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.index === ev.rowIndex && this.column.index === ev.columnIndex) {
        if (ev.editMode) {
          this.switchCellToEditMode();
        } else {
          this.switchCellToViewMode();
          this.cd.markForCheck();
        }
      }
    });
    this.subscriptions.push(subDblClickCell);
    this.subscriptions.push(subKeydownCell);
    this.subscriptions.push(subCellEditMode);
  }

  switchCellToEditMode() {
    if (this.column.editable) {
      this.editing = true;
      this.cd.markForCheck();
    }
  }

  switchCellToViewMode() {
    this.editing = false;
    if (this.row[this.column.name] !== this.tempValue) {
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
    if (!this.column.options) {
      event.preventDefault();
    }
  }

  onCellEditorKeydown(event: any) {
    if (event.keyCode === Keys.ENTER) {
      this.table.events.onEdit(this.row);
      this.switchCellToViewMode();
      this.element.nativeElement.focus();
    } else if (event.keyCode === Keys.ESCAPE) {
      this.editing = false;
      this.row[this.column.name] = this.tempValue;
      this.updateValue();
      this.element.nativeElement.focus();
    }
  }

  getOptions(row: Row[]) {
    return this.column.getOptions(row[this.column.dependsColumn]);
  }

  onInputBlur() {
    if (this.table.settings.editMode !== Constants.editProgrammatically) {
      this.switchCellToViewMode();
    }
  }

}
