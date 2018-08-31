import {
  Component, OnInit, Input, HostListener, ChangeDetectionStrategy, ChangeDetectorRef,
  HostBinding, ElementRef, ViewEncapsulation
} from '@angular/core';
import { MenuItem, MenuEventArgs } from './types';

@Component({
  selector: 'app-row-menu',
  templateUrl: './row-menu.component.html',
  styleUrls: ['context-menu.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RowMenuComponent implements OnInit {

  @Input() menu: MenuItem[] = [];

  left: number;
  top: number;
  isVisible: boolean;
  selectContainerClicked: boolean;

  @HostBinding('class') cssClass = 'dropdown-row-menu';

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
    return (this.isVisible) ? 'block' : 'none';
  }

  private eventArgs: MenuEventArgs;

  constructor(private cd: ChangeDetectorRef, private element: ElementRef) {
  }

  ngOnInit() {
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    if (!this.selectContainerClicked) {
      this.closeDropdown();
    }
    this.selectContainerClicked = false;
  }

  @HostListener('window:keydown.esc', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.closeDropdown();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.closeDropdown();
  }

  getPositionMenu(left: number, top: number, rowHeight: number) {
    const menu = this.element.nativeElement;
    const {height, width} = this.getHiddenElementOuterSizes(menu);
    // flip
    if (left + width - window.pageXOffset > window.innerWidth) {
      left -= width;
    }
    // flip
    if (top + height - window.pageYOffset > window.innerHeight) {
      top -= height + rowHeight;
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

  openDropdown() {
    if (!this.isVisible && this.menu.length > 0) {
      this.isVisible = true;
    }
  }

  closeDropdown() {
    if (this.isVisible) {
      this.isVisible = false;
      this.cd.markForCheck();
    }
  }

  show(event: MenuEventArgs) {
    this.eventArgs = event;
    this.selectContainerClicked = true;
    const coords = this.getPositionMenu(event.left, event.top, event.rowHeight);

    if (this.top === coords.top && this.left === coords.left) {
      this.isVisible ? this.closeDropdown() : this.openDropdown();
    } else {
      this.top = coords.top;
      this.left = coords.left;
      this.closeDropdown();
      this.openDropdown();
    }
  }

  hide() {
    this.closeDropdown();
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
    this.isVisible = false;
  }

}
