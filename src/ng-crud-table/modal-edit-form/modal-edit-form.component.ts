import {Component, OnInit, Input, ViewChild, PipeTransform} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {Column} from '../models/column';
import {DataManager} from '../models/data-manager';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html'
})
export class ModalEditFormComponent implements OnInit {

  @Input() public dataManager: DataManager;
  @Input() public zIndex: number;

  @ViewChild('childModal') childModal: ModalComponent;

  constructor() {
  }

  ngOnInit() {
  }

  modalTitle() {
    if (!this.dataManager.detailView) {
      return this.dataManager.isNewItem ? this.dataManager.settings.messages.titleCreate :
        this.dataManager.settings.messages.titleUpdate;
    } else {
      return this.dataManager.settings.messages.titleDetailView;
    }
  }

  save() {
    this.dataManager.saveRow();
    this.childModal.hide();
  }

  delete() {
    this.dataManager.deleteRow();
    this.childModal.hide();
  }

  public open() {
    this.childModal.show();
  }

  public close() {
    this.childModal.hide();
  }

  format(column: Column) {
    let value = this.dataManager.item[column.name];
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
