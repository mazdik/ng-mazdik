import {Component, OnInit, Input, ViewChild, PipeTransform} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {Column} from '../models/column';
import {CrudTable} from '../models/crud-table';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html'
})
export class ModalEditFormComponent implements OnInit {

  @Input() public crudTable: CrudTable;
  @Input() public zIndex: number;

  @ViewChild('childModal') childModal: ModalComponent;

  constructor() {
  }

  ngOnInit() {
  }

  modalTitle() {
    if (!this.crudTable.detailView) {
      return this.crudTable.isNewItem ? this.crudTable.table.settings.messages.titleCreate :
        this.crudTable.table.settings.messages.titleUpdate;
    } else {
      return this.crudTable.table.settings.messages.titleDetailView;
    }
  }

  save() {
    this.crudTable.saveRow();
    this.childModal.hide();
  }

  delete() {
    this.crudTable.deleteRow();
    this.childModal.hide();
  }

  public open() {
    this.childModal.show();
  }

  public close() {
    this.childModal.hide();
  }

  format(column: Column) {
    let value = this.crudTable.item[column.name];
    const userPipe: PipeTransform = column.pipe;
    if (userPipe) {
      return userPipe.transform(value);
    }
    if (value) {
      value = column.getOptionName(value);
    }
    return value;
  }

}
