import {
  Component, Input, HostListener, ChangeDetectionStrategy, ChangeDetectorRef,
  HostBinding, ElementRef, ViewEncapsulation
} from '@angular/core';
import {Dropdown, MenuItem} from '../common';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['../styles/context-menu.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContextMenuComponent extends Dropdown {

  @Input() items: MenuItem[];

  @HostBinding('class.dt-context-menu') cssClass = true;

  @HostBinding('style.display')
  get getDisplay(): string {
    return (this.isOpen && this.items.length > 0) ? 'block' : 'none';
  }

  constructor(cd: ChangeDetectorRef, private element: ElementRef) {
    super(cd);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.closeDropdown();
  }

  positionMenu(event) {
    let left = event.pageX + 1;
    let top = event.pageY + 1;
    const menu = this.element.nativeElement;
    const {height, width} = this.getHiddenElementOuterSizes(menu);
    // flip
    if (left + width - document.body.scrollLeft > window.innerWidth) {
        left -= width;
    }
    // flip
    if (top + height - document.body.scrollTop > window.innerHeight) {
        top -= height;
    }
    // fit
    if (left < document.body.scrollLeft) {
        left = document.body.scrollLeft;
    }
    // fit
    if (top < document.body.scrollTop) {
        top = document.body.scrollTop;
    }
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }

  getHiddenElementOuterSizes(element: HTMLElement) {
    if (element.offsetParent) {
      return { height: element.offsetHeight, width: element.offsetWidth };
    }
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementHeight = element.offsetHeight;
    const elementWidth = element.offsetWidth;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return { height: elementHeight, width: elementWidth };
  }

  show(event: MouseEvent) {
    this.positionMenu(event);
    this.openDropdown();
    event.preventDefault();
  }

  itemClick(event, item: MenuItem) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url) {
      event.preventDefault();
    }
    if (item.command) {
      item.command({originalEvent: event, item: item});
    }
    this.isOpen = false;
  }

}
