import {Component, Input, Output, EventEmitter, OnInit, PipeTransform} from '@angular/core';
import {Column, Settings, ICrudService} from '../types/interfaces';
import {ColumnUtils} from '../utils/column-utils';

@Component({
  selector: 'app-detail-view',
  templateUrl: 'detail-view.component.html',
  styleUrls: ['detail-view.component.css'],
})

export class DetailViewComponent implements OnInit {

  @Input() public columns: Column[];
  @Input() public settings: Settings;
  @Input() public service: ICrudService;
  @Input() public item: any;

  @Output() updated: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() errors: EventEmitter<any> = new EventEmitter();

  public edit: boolean = false;
  public loading: boolean = false;
  public formValid: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  format(value: any, column: Column) {
    const userPipe: PipeTransform = column.pipe;
    if (userPipe) {
      return userPipe.transform(value);
    }
    if (value) {
      value = ColumnUtils.getOptionName(value, column);
    }
    return value;
  }

  closeForm() {
    this.edit = false;
  }

  toggleForm() {
    this.edit = !this.edit;
  }

  closeDetails() {
    this.onClose.emit(true);
  }

  saveItem() {
    this.loading = true;
    this.service
      .put(this.item)
      .then(res => {
        this.loading = false;
        this.errors.emit(null);
        this.updated.emit(res);
        this.edit = false;
      })
      .catch(error => {
        this.loading = false;
        this.errors.emit(error);
      });
  }

  deleteItem() {
    this.loading = true;
    this.service
      .delete(this.item)
      .then(res => {
        this.loading = false;
        this.errors.emit(null);
        this.deleted.emit(true);
        this.item = null;
        this.onClose.emit(true);
      })
      .catch(error => {
        this.loading = false;
        this.errors.emit(error);
      });
  }


}
