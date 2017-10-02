import {Component, OnInit, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {Column, Settings, ICrudService} from '../types/interfaces';
import {Http} from '@angular/http';
import {MainService} from '../services/main.service';

@Component({
  selector: 'modal-edit-form',
  templateUrl: './modal-edit-form.component.html',
  styleUrls: ['./modal-edit-form.component.css']
})
export class ModalEditFormComponent implements OnInit {

  @Input() public columns: Column[];
  @Input() public settings: Settings;

  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() updated: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() loading: EventEmitter<any> = new EventEmitter();
  @Output() errors: EventEmitter<any> = new EventEmitter();

  @Input() set item(value) {
    this._item = value;
    this.newItem = this.isEmpty(value);
  }
  get item() {
    return this._item;
  }
  private _item: any;

  public service: ICrudService;
  public newItem: boolean;
  @ViewChild('childModal')
  public readonly childModal: ModalComponent;

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.service = MainService.getInstance(this.settings, this.http);
  }

  modalTitle() {
    return this.newItem ? 'Create' : 'Update';
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
    return Object.getOwnPropertyNames(obj).length === 0 ? true : false;
  }

}
