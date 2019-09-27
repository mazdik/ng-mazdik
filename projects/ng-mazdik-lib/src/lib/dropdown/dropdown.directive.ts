import { Directive, HostListener, ElementRef, OnDestroy, HostBinding } from '@angular/core';
import { DropdownService } from './dropdown.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnDestroy {

  @HostBinding('class.open') isOpen: boolean = false;
  private subscription: Subscription;

  constructor(private elementRef: ElementRef, private service: DropdownService) {
    this.subscription = this.service.currentElement.subscribe(el => {
      if (el !== this.elementRef && this.isOpen) {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('click', ['$event'])
  toggleDropdown(event): boolean {
    event.stopPropagation();
    this.service.currentElement.next(this.elementRef);
    this.toggle();
    return false;
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

}
