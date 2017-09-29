import {Component, Input, Output, EventEmitter, HostBinding} from '@angular/core';
import {Column, MenuItem} from '../types/interfaces';

@Component({
  selector: 'datatable-body',
  templateUrl: './body.component.html',
  host: {
    class: 'datatable-body'
  }
})
export class BodyComponent {

  @Input() public columns: Column[];
  @Input() public items: any;
  @Input() public actionColumnWidth: number;
  @Input() public actionMenu: MenuItem[];
  @Input() public offsetX: number;
  @Input() public selectedRowIndex: number;

  @Input()
  @HostBinding('style.height')
  set bodyHeight(val) {
    if (val) {
      this._bodyHeight = val + 'px';
    } else {
      this._bodyHeight = 'auto';
    }
  }

  get bodyHeight() {
    return this._bodyHeight;
  }

  @Output() editComplete: EventEmitter<any> = new EventEmitter();
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @Output() selectedRowIndexChange: EventEmitter<number> = new EventEmitter();

  offsetY: number = 0;
  _bodyHeight: any;

  constructor() {
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


}
