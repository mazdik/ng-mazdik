import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {DataManager} from '../../ng-crud-table/base';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html'
})
export class ModalEditFormComponent implements OnInit {

  @Input() dataManager: DataManager;
  @Input() detailView: boolean;
  @Input() isNewItem: boolean;

  @Output() loaded: EventEmitter<any> = new EventEmitter();

  @ViewChild('childModal') childModal: ModalComponent;

  formValid: boolean = true;

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

  open() {
    this.childModal.show();
  }

  close() {
    this.childModal.hide();
  }

  onFormValid(event: any) {
    this.formValid = event;
  }

}
