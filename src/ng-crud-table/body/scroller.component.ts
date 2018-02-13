import {
  Component, Input, ElementRef, Output, EventEmitter,
  OnInit, OnDestroy, HostBinding, ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-datatable-scroller',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollerComponent implements OnInit, OnDestroy {

  @HostBinding('style.height.px')
  @Input() scrollHeight: number;

  @HostBinding('style.width.px')
  @Input() scrollWidth: number;

  @Output() scroll: EventEmitter<any> = new EventEmitter();

  @HostBinding('class') cssClass = 'datatable-scroll';

  scrollYPos: number = 0;
  scrollXPos: number = 0;
  prevScrollYPos: number = 0;
  prevScrollXPos: number = 0;
  parentElement: HTMLElement;

  constructor(private element: ElementRef) {
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

    this.scroll.emit({
      direction,
      scrollYPos: this.scrollYPos,
      scrollXPos: this.scrollXPos
    });

    this.prevScrollYPos = this.scrollYPos;
    this.prevScrollXPos = this.scrollXPos;
  }

}
