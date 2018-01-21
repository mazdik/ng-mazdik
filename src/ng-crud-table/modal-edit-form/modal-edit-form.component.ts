import {Component, OnInit, Input, Output, ViewChild, EventEmitter, PipeTransform, ViewEncapsulation} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {ColumnModel, ICrudService, DataTable} from '../types';


@Component({
  selector: 'modal-edit-form',
  templateUrl: './modal-edit-form.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalEditFormComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public service: ICrudService;
  @Input() public zIndex: number;
  @Input() public view: boolean;

  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() updated: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() loading: EventEmitter<any> = new EventEmitter();
  @Output() errors: EventEmitter<any> = new EventEmitter();

  @Input() set item(value) {
    this._item = value;
    this.newItem = this.isEmpty(value);
    if (this.newItem) {
      this._item = {};
    }
  }
  get item() {
    return this._item;
  }

  @ViewChild('childModal')

  public readonly childModal: ModalComponent;
  public formValid: boolean = true;
  public newItem: boolean;
  private _item: any;

  constructor() {
  }

  ngOnInit() {
    this.service.url = this.table.settings.api;
    this.service.primaryKeys = this.table.settings.primaryKeys;
  }

  modalTitle() {
    if (!this.view) {
      return this.newItem ? 'Create' : 'Update';
    } else {
      return 'Detail view';
    }
  }

  save() {
    this.loading.emit(true);
    if (this.newItem) {
      this.service
        .post(this.item)
        .then(res => {
          this.loading.emit(false);
          this.errors.emit(null);
          this.saved.emit(res);
          this.item = res;
        })
        .catch(error => {
          this.loading.emit(false);
          this.errors.emit(error);
        });
    } else {
      this.service
        .put(this.item)
        .then(res => {
          this.loading.emit(false);
          this.errors.emit(null);
          this.updated.emit(res);
        })
        .catch(error => {
          this.loading.emit(false);
          this.errors.emit(error);
        });
    }
    this.childModal.hide();
  }

  delete() {
    this.loading.emit(true);
    this.service
      .delete(this.item)
      .then(res => {
        this.loading.emit(false);
        this.errors.emit(null);
        this.deleted.emit(true);
        this.item = null;
      })
      .catch(error => {
        this.loading.emit(false);
        this.errors.emit(error);
      });
    this.childModal.hide();
  }

  public open() {
    this.childModal.show();
  }

  public close() {
    this.childModal.hide();
  }

  isEmpty(obj) {
    if (obj === null ||
      obj === undefined ||
      Array.isArray(obj) ||
      typeof obj !== 'object'
    ) {
      return true;
    }
    return (Object.getOwnPropertyNames(obj).length === 0);
  }

  format(value: any, column: ColumnModel) {
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
