import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {DataManager} from '../../ng-crud-table/base';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html',
  styleUrls: ['modal-edit-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditFormComponent implements OnInit {

  @Input() dataManager: DataManager;
  @Input() isNewItem: boolean;

  @Input()
  get detailView(): boolean {
    return this._detailView;
  }
  set detailView(val: boolean) {
    this._detailView = val;
    this.transposedData = [];
    for (const column of this.dataManager.columns) {
      this.transposedData.push({key: column.title, value: column.getValueView(this.dataManager.item)});
    }
  }

  @Output() loaded: EventEmitter<any> = new EventEmitter();

  @ViewChild('childModal') childModal: ModalComponent;

  formValid: boolean = true;
  transposedData: any[];
  getOptionsFunc: Function;

  private _detailView: boolean;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getOptionsFunc = this.dataManager.service.getOptions.bind(this.dataManager.service);
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
    this.cd.markForCheck();
  }

  open() {
    this.childModal.show();
    this.cd.markForCheck();
  }

  close() {
    this.childModal.hide();
    this.cd.markForCheck();
  }

  onFormValid(event: any) {
    this.formValid = event;
  }

}
