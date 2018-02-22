import {
  Component, Input, HostBinding, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Subscription} from 'rxjs/Subscription';
import {translate} from '../base/util';

@Component({
  selector: 'app-datatable-body',
  templateUrl: './body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;
  @Input() public loading: boolean;

  @HostBinding('class') cssClass = 'datatable-body';

  rowTrackingFn: any;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
    // declare fn here so we can get access to the `this` property
    this.rowTrackingFn = function (index: number, row: any): any {
      if (this.table.settings.trackByProp) {
        return `${index}-${this.table.settings.trackByProp}`;
      } else {
        return index;
      }
    }.bind(this);
  }

  @HostBinding('style.height')
  get bodyHeight() {
    if (this.table.scrollHeight) {
      return this.table.scrollHeight + 'px';
    } else {
      return 'auto';
    }
  }

  ngOnInit(): void {
    const subRows = this.table.dataService.rowsSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subScroll = this.table.dataService.scrollSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  stylesByGroup() {
    return translate(this.table.offsetX, 0);
  }

}
