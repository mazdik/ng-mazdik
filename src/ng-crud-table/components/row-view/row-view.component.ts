import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {DataManager} from '../../base';

@Component({
  selector: 'app-row-view',
  templateUrl: './row-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowViewComponent implements OnInit {

  @Input() public dataManager: DataManager;

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
