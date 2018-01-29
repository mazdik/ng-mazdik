import {
  Component, Input, Output, EventEmitter, HostBinding, OnInit, ChangeDetectionStrategy
} from '@angular/core';
import {DataTable} from '../types';


@Component({
  selector: 'app-datatable-body',
  templateUrl: './body.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public rows: any;
  @Input() public offsetX: number;
  @Input() public selectedRowIndex: number;
  @Input() public trackByProp: string;
  @Input() public loading: boolean = false;

  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();

  @HostBinding('class') cssClass = 'datatable-body';

  offsetY: number = 0;
  rowTrackingFn: any;

  constructor() {
    // declare fn here so we can get access to the `this` property
    this.rowTrackingFn = function (index: number, row: any): any {
      if (this.trackByProp) {
        return `${index}-${this.trackByProp}`;
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
  }

  onBodyScroll(event: any): void {
    const scrollYPos: number = event.scrollYPos;
    const scrollXPos: number = event.scrollXPos;

    // if scroll change, trigger update
    // this is mainly used for header cell positions
    if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
      this.scroll.emit({
        offsetY: scrollYPos,
        offsetX: scrollXPos
      });
    }
    this.offsetY = scrollYPos;
    this.offsetX = scrollXPos;
  }

  onEditComplete(event) {
    this.editComplete.emit(event);
  }

}
