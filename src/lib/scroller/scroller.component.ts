import {
  Component, Input, Output, EventEmitter, HostBinding, ElementRef, OnDestroy, OnInit, ViewChild,
  ViewEncapsulation, NgZone, ChangeDetectionStrategy
} from '@angular/core';
import {RowHeightCache} from './row-height-cache';

@Component({
  selector: 'app-scroller, [scroller]',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerComponent implements OnInit, OnDestroy {

  @Input()
  get items(): any[] { return this._items; }
  set items(val: any[]) {
    this._items = val;
    if (this.virtualScroll) {
      this.resetPosition();
      this.chunkRows(true);
    }
  }
  private _items: any[];

  @Input() virtualScroll: boolean;
  @Input() rowHeight: number;
  @Input() itemsPerRow: number = 20;
  @Input() rowHeightProp: string;

  @HostBinding('style.height.px')
  @Input() scrollHeight: number;

  @HostBinding('style.width.px')
  @Input() scrollWidth: number;

  @Output() scroll: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-scroller') cssClass = true;
  @HostBinding('class.dt-virtual-scroll')
  get isVirtualScroll(): boolean {
    return this.virtualScroll;
  }

  @ViewChild('content') content: ElementRef;

  get viewRows(): any[] {
    return (this.virtualScroll) ? this._viewRows : this.items;
  }
  set viewRows(val: any[]) {
    this._viewRows = val;
  }
  private _viewRows: any[];

  scrollYPos: number = 0;
  scrollXPos: number = 0;
  prevScrollYPos: number = 0;
  prevScrollXPos: number = 0;
  element: HTMLElement;
  scrollLength: number;
  start: number;
  end: number;
  private previousStart: number;
  private previousEnd: number;
  private rowHeightCache: RowHeightCache = new RowHeightCache();

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.element.addEventListener('scroll', this.onScrolled.bind(this));
    });
  }

  ngOnDestroy() {
    this.element.removeEventListener('scroll', this.onScrolled.bind(this));
  }

  onScrolled(event: MouseEvent) {
    const dom: Element = <Element>event.currentTarget;
    this.scrollYPos = dom.scrollTop;
    this.scrollXPos = dom.scrollLeft;

    let direction: string;
    if (this.scrollYPos < this.prevScrollYPos) {
      direction = 'up';
    } else if (this.scrollYPos > this.prevScrollYPos) {
      direction = 'down';
    }

    if (this.prevScrollYPos !== this.scrollYPos || this.prevScrollXPos !== this.scrollXPos) {
      if (direction && this.virtualScroll) {
        this.chunkRows();
        let topPadding = this.rowHeight * this.start;
        if (this.rowHeightProp) {
          topPadding = this.rowHeightCache.getRowOffset(this.start - 1);
        }
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            this.content.nativeElement.style.transform = `translateY(${topPadding}px)`;
          });
        });
      }

      this.scroll.emit({
        direction,
        scrollYPos: this.scrollYPos,
        scrollXPos: this.scrollXPos
      });
      this.prevScrollYPos = this.scrollYPos;
      this.prevScrollXPos = this.scrollXPos;
    }
  }

  setOffsetY(offsetY: number) {
    if (this.element) {
      this.element.scrollTop = offsetY;
    }
  }

  setPageOffsetY(page: number) {
    const rowIndex = this.itemsPerRow * (page - 1);
    let offset = 0;
    if (this.rowHeightProp) {
      offset = this.rowHeightCache.getRowOffset(rowIndex - 1);
    } else {
      offset = this.rowHeight * rowIndex;
    }
    this.setOffsetY(offset);
  }

  private calculateDimensions() {
    if (this.rowHeightProp) {
      this.rowHeightCache.initCache(this.items, this.rowHeightProp);
    }
    if (this.items && this.items.length) {
      const totalRecords = this.items.length;
      if (this.rowHeightProp) {
        this.scrollLength = this.rowHeightCache.calcScrollLength(totalRecords);
      } else {
        this.scrollLength = this.rowHeight * totalRecords;
      }
    }
    if (this.scrollHeight && this.rowHeight) {
      this.itemsPerRow = Math.round(this.scrollHeight / this.rowHeight);
    } else {
      this.scrollHeight = this.itemsPerRow * this.rowHeight;
      if (this.scrollHeight > 0) {
        this.scrollHeight -= this.rowHeight; // for lazy load
      }
    }
  }

  chunkRows(force: boolean = false) {
    this.calculateDimensions();
    const totalRecords = this.items.length;
    if (this.rowHeightProp) {
      this.start = this.rowHeightCache.calcRowIndex(this.scrollYPos);
    } else {
      this.start = Math.floor(this.scrollYPos / this.rowHeight);
    }
    this.end = Math.min(totalRecords, this.start + this.itemsPerRow + 1);
    if ((this.end - this.start) < this.itemsPerRow) {
      this.start = totalRecords - this.itemsPerRow - 1;
      this.end = totalRecords;
    }

    if (this.start !== this.previousStart || this.end !== this.previousEnd || force === true) {
      const virtualRows = this.items.slice(this.start, this.end);
      this.previousStart = this.start;
      this.previousEnd = this.end;
      this.viewRows = virtualRows;
    }
  }

  resetPosition() {
    this.start = 0;
    this.end = 0;
    this.previousStart = 0;
    this.previousEnd = 0;
  }

}
