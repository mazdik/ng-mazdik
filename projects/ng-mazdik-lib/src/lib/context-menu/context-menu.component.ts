import {
  Component, Input, HostListener, ChangeDetectionStrategy, ChangeDetectorRef,
  HostBinding, ElementRef, OnInit, OnDestroy
} from '@angular/core';
import { MenuEventArgs } from './types';
import { DropDown } from '../dropdown/drop-down';
import { MenuItem } from '../common';
import { isBlank } from '../common/utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  @Input() menu: MenuItem[] = [];

  left: number;
  top: number;

  @HostBinding('class.dt-context-menu') cssClass = true;

  @HostBinding('style.left.px')
  get getLeft(): number {
    return this.left;
  }

  @HostBinding('style.top.px')
  get getTop(): number {
    return this.top;
  }

  @HostBinding('style.display')
  get getDisplay(): string {
    return (this.dropdown.isOpen && this.menu.length > 0) ? 'block' : 'none';
  }

  private eventArgs: MenuEventArgs;
  private dropdown: DropDown;
  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
    this.dropdown = new DropDown(this.element.nativeElement);
  }

  ngOnInit() {
    const subDropdown = this.dropdown.isOpenSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subDropdown);
  }

  ngOnDestroy() {
    this.dropdown.removeEventListeners();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.dropdown.closeDropdown();
  }

  getPositionMenu(left: number, top: number) {
    const menu = this.element.nativeElement;
    const {height, width} = this.getHiddenElementOuterSizes(menu);
    // flip
    if (left + width - window.pageXOffset > window.innerWidth) {
      left -= width;
    }
    // flip
    if (top + height - window.pageYOffset > window.innerHeight) {
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
    return { left, top };
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

  show(event: MenuEventArgs) {
    this.eventArgs = event;
    let coords;
    if (!isBlank(event.left) && !isBlank(event.top)) {
      coords = this.getPositionMenu(event.left, event.top);
      this.dropdown.selectContainerClicked = true;
    } else {
      coords = this.getPositionMenu(event.originalEvent.pageX + 1, event.originalEvent.pageY + 1);
    }
    event.originalEvent.preventDefault();

    if (this.top === coords.top && this.left === coords.left) {
      this.dropdown.toggleDropdown();
    } else {
      this.top = coords.top;
      this.left = coords.left;
      this.dropdown.closeDropdown();
      this.dropdown.openDropdown();
    }
  }

  hide() {
    this.dropdown.closeDropdown();
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
      item.command(this.eventArgs.data);
    }
    this.dropdown.isOpen = false;
  }

}
