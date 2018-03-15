import {Directive, Input, ElementRef, OnInit, OnDestroy, NgZone} from '@angular/core';
import {DataTable} from '../base/data-table';

@Directive({
  selector: '[appBodyScroll]'
})
export class BodyScrollDirective implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  scrollYPos: number = 0;
  scrollXPos: number = 0;
  prevScrollYPos: number = 0;
  prevScrollXPos: number = 0;
  element: HTMLElement;

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    this.element.addEventListener('scroll', this.onScrolled.bind(this));
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('scroll', this.onScrolled.bind(this));
  }

  setOffset(offsetY: number): void {
    if (this.element) {
      this.element.scrollTop = offsetY;
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
