import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {DataManager} from '../../ng-crud-table/base';
import {DynamicFormElement} from '../dynamic-form';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html',
  styleUrls: ['../styles/buttons.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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

  dynElements: DynamicFormElement[];
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
    this.createDynamicFormElements();
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

  createDynamicFormElements() {
    this.dynElements = [];
    for (const column of this.dataManager.columns) {
      const element = new DynamicFormElement();
      element.name = column.name;
      element.title = column.title;
      element.options = column.options;
      element.optionsUrl = column.optionsUrl;
      element.type = column.type;
      element.validatorFunc = column.validatorFunc;
      element.dependsElement = column.dependsColumn;
      element.cellTemplate = column.cellTemplate;
      element.formHidden = column.formHidden;
      element.isPrimaryKey = column.isPrimaryKey;
      element.keyElement = column.keyColumn;
      this.dynElements.push(element);
    }
  }

}
