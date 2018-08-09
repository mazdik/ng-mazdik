import {Directive, Input, ElementRef, OnInit, OnDestroy, NgZone} from '@angular/core';
import {DataTable} from '../base';

@Directive({
  selector: '[appBodyScroll]'
})
export class BodyScrollDirective implements OnInit, OnDestroy {

  @Input() table: DataTable;

  prevScrollYPos: number = 0;
  prevScrollXPos: number = 0;
  element: HTMLElement;

  constructor(element: ElementRef, private ngZone: NgZone) {
    this.element = element.nativeElement;
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.element.addEventListener('scroll', this.onScrolled.bind(this));
    });
  }

  ngOnDestroy(): void {
    this.element.removeEventListener('scroll', this.onScrolled.bind(this));
  }

  setOffsetY(offsetY: number): void {
    if (this.element) {
      this.element.scrollTop = offsetY;
    }
  }

  onScrolled(event: MouseEvent): void {
    const dom: Element = <Element>event.currentTarget;
    const scrollYPos = dom.scrollTop;
    const scrollXPos = dom.scrollLeft;

    let direction: string;
    if (scrollYPos < this.prevScrollYPos) {
      direction = 'up';
    } else if (scrollYPos > this.prevScrollYPos) {
      direction = 'down';
    }

    if (this.prevScrollYPos !== scrollYPos || this.prevScrollXPos !== scrollXPos) {
      this.table.dimensions.offsetY = scrollYPos;
      this.table.dimensions.offsetX = scrollXPos;
      this.table.events.onScroll({direction});

      this.prevScrollYPos = scrollYPos;
      this.prevScrollXPos = scrollXPos;
    }
  }

}
