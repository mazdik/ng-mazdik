import {Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import {DataManager} from '../../ng-crud-table/base';

@Component({
  selector: 'app-row-view',
  templateUrl: './row-view.component.html',
  styleUrls: ['row-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RowViewComponent implements OnInit {

  @Input() dataManager: DataManager;

  order: string;
  reverse: boolean = true;
  transposedData: any[];

  constructor() {
  }

  ngOnInit() {
    this.transposedData = [];
    for (const column of this.dataManager.columns) {
      this.transposedData.push({key: column.title, value: column.getValueView(this.dataManager.item)});
    }
  }

  setOrder(name: string) {
    if (this.order === name) {
      this.reverse = !this.reverse;
    }
    this.order = name;
  }

  isOrder(name: string) {
    return this.order === name && this.reverse;
  }

  isOrderReverse(name: string) {
    return this.order === name && !this.reverse;
  }

}
