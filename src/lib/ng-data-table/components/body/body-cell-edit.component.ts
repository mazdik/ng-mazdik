import {Component, ElementRef, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {BodyCellComponent} from './body-cell.component';
import {CellEventArgs, EditMode, CellEventType} from '../../base';
import {Keys} from '../../../common';

@Component({
  selector: 'dt-body-cell-edit',
  templateUrl: './body-cell-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellEditComponent extends BodyCellComponent implements OnInit {

  tempValue: any;

  constructor(cd: ChangeDetectorRef, element: ElementRef) {
    super(cd, element);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const subCell = this.table.events.cellSource$.subscribe((ev: CellEventArgs) => this.eventHandler(ev));
    this.subscriptions.push(subCell);
  }

  eventHandler(ev: CellEventArgs) {
    if (this.cell.exist(ev.rowIndex, ev.columnIndex)) {
      if (ev.type === CellEventType.DblClick) {
        if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
          this.switchCellToEditMode();
        }
      }
      if (ev.type === CellEventType.Keydown) {
        if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
          this.onCellKeydown(ev.event);
        }
      }
      if (ev.type === CellEventType.EditMode) {
        if (ev.editMode) {
          this.switchCellToEditMode();
        } else {
          this.switchCellToViewMode();
          this.cd.markForCheck();
        }
      }
    }
  }

  switchCellToEditMode() {
    if (this.cell.column.editable) {
      this.editing = true;
      this.cell.validate();
      this.cd.markForCheck();
    }
  }

  switchCellToViewMode() {
    this.editing = false;
    if (this.cell.value !== this.tempValue) {
      this.updateValue();
      this.table.events.onCellValueChanged({
        columnIndex: this.cell.column.index,
        rowIndex: this.cell.rowIndex
      } as CellEventArgs);
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
    if (!this.cell.column.options) {
      event.preventDefault();
    }
  }

  onCellEditorKeydown(event: any) {
    if (event.keyCode === Keys.ENTER) {
      this.switchCellToViewMode();
      this.element.nativeElement.focus();
    } else if (event.keyCode === Keys.ESCAPE) {
      this.editing = false;
      this.cell.value = this.tempValue;
      this.updateValue();
      this.element.nativeElement.focus();
    }
  }

  onInputBlur() {
    if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
      this.switchCellToViewMode();
    }
  }

  onInputFocus() {
    this.tempValue = this.cell.value;
  }

}
