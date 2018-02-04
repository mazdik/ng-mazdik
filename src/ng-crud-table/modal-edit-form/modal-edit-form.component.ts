import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  PipeTransform,
  ViewEncapsulation
} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {Column} from '../models/column';
import {CrudTable} from '../models/crud-table';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.component.html',
  styleUrls: ['../styles/index.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalEditFormComponent implements OnInit {

  @Input() public crudTable: CrudTable;
  @Input() public zIndex: number;
  @Input() public view: boolean;

  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() updated: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();

  @ViewChild('childModal')

  public readonly childModal: ModalComponent;
  public formValid: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  modalTitle() {
    if (!this.view) {
      return this.crudTable.isNewItem ? this.crudTable.table.settings.messages.titleCreate :
        this.crudTable.table.settings.messages.titleUpdate;
    } else {
      return this.crudTable.table.settings.messages.titleDetailView;
    }
  }

  save() {
    this.crudTable.loading = true;
    if (this.crudTable.isNewItem) {
      this.crudTable.service
        .post(this.crudTable.item)
        .then(res => {
          this.crudTable.loading = false;
          this.crudTable.errors = null;
          this.saved.emit(res);
          this.crudTable.item = res;
        })
        .catch(error => {
          this.crudTable.loading = false;
          this.crudTable.errors = error;
        });
    } else {
      this.crudTable.service
        .put(this.crudTable.item)
        .then(res => {
          this.crudTable.loading = false;
          this.crudTable.errors = null;
          this.updated.emit(res);
        })
        .catch(error => {
          this.crudTable.loading = false;
          this.crudTable.errors = error;
        });
    }
    this.childModal.hide();
  }

  delete() {
    this.crudTable.loading = true;
    this.crudTable.service
      .delete(this.crudTable.item)
      .then(res => {
        this.crudTable.loading = false;
        this.crudTable.errors = null;
        this.deleted.emit(true);
        this.crudTable.item = null;
      })
      .catch(error => {
        this.crudTable.loading = false;
        this.crudTable.errors = error;
      });
    this.childModal.hide();
  }

  public open() {
    this.childModal.show();
  }

  public close() {
    this.childModal.hide();
  }

  format(value: any, column: Column) {
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
