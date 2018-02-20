import {
  Component, Input, ElementRef, OnInit, OnDestroy, HostBinding, ChangeDetectionStrategy, NgZone
} from '@angular/core';
import {DataTable} from '../base/data-table';

@Component({
  selector: 'app-datatable-body-scroll',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyScrollComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  @HostBinding('style.height.px')
  @Input() scrollHeight: number;

  @HostBinding('style.width.px')
  @Input() scrollWidth: number;

  @HostBinding('class') cssClass = 'datatable-scroll';

  scrollYPos: number = 0;
  scrollXPos: number = 0;
  prevScrollYPos: number = 0;
  prevScrollXPos: number = 0;
  parentElement: HTMLElement;

  constructor(private element: ElementRef, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.parentElement = this.element.nativeElement.parentElement.parentElement;
    this.parentElement.addEventListener('scroll', this.onScrolled.bind(this));
  }

  ngOnDestroy(): void {
    this.parentElement.removeEventListener('scroll', this.onScrolled.bind(this));
  }

  setOffset(offsetY: number): void {
    if (this.parentElement) {
      this.parentElement.scrollTop = offsetY;
    }
  }

  onScrolled(event: MouseEvent): void {
    const dom: Element = <Element>event.currentTarget;
    this.scrollYPos = dom.scrollTop;
    this.scrollXPos = dom.scrollLeft;
    this.updateOffset();
  }

  updateOffset(): void {
    let direction: string;
    if (this.scrollYPos < this.prevScrollYPos) {
      direction = 'down';
    } else if (this.scrollYPos > this.prevScrollYPos) {
      direction = 'up';
    }

    if (this.prevScrollYPos !== this.scrollYPos || this.prevScrollXPos !== this.scrollXPos) {
      this.table.offsetY = this.scrollYPos;
      this.table.offsetX = this.scrollXPos;

      this.table.dataService.onScroll(direction);

      this.prevScrollYPos = this.scrollYPos;
      this.prevScrollXPos = this.scrollXPos;
    }
  }

}
