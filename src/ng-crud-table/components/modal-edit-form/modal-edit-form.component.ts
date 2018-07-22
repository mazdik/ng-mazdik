import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {DataManager} from '../../base';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html'
})
export class ModalEditFormComponent implements OnInit {

  @Input() public dataManager: DataManager;
  @Input() public detailView: boolean;
  @Input() public isNewItem: boolean;

  @ViewChild('childModal') childModal: ModalComponent;

  public formValid: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  modalTitle() {
    if (!this.detailView) {
      return this.isNewItem ? this.dataManager.messages.titleCreate :
        this.dataManager.messages.titleUpdate;
    } else {
      return this.dataManager.messages.titleDetailView;
    }
  }

  save() {
    if (this.isNewItem) {
      this.dataManager.create(this.dataManager.item);
    } else {
      this.dataManager.update(this.dataManager.item);
    }
    this.childModal.hide();
  }

  public open() {
    this.childModal.show();
  }

  public close() {
    this.childModal.hide();
  }

  onFormValid(event: any) {
    this.formValid = event;
  }

}
