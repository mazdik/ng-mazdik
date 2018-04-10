import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {DataManager} from '../base/data-manager';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html'
})
export class ModalEditFormComponent implements OnInit {

  @Input() public dataManager: DataManager;

  @ViewChild('childModal') childModal: ModalComponent;

  constructor() {
  }

  ngOnInit() {
  }

  modalTitle() {
    if (!this.dataManager.detailView) {
      return this.dataManager.isNewItem ? this.dataManager.messages.titleCreate :
        this.dataManager.messages.titleUpdate;
    } else {
      return this.dataManager.messages.titleDetailView;
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

}
