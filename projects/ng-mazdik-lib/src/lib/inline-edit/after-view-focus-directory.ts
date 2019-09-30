import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
 selector: '[appAfterViewFocus]',
})
export class AfterViewFocusDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.elementRef.nativeElement.focus();
  }

}
