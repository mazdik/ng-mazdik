import {
  Component, OnInit, OnDestroy, Input, HostListener, ChangeDetectionStrategy, ChangeDetectorRef,
  HostBinding, ElementRef
} from '@angular/core';
import { DataManager, MenuItem, RowMenuEventArgs, Row } from '../../base';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-row-menu',
  templateUrl: './row-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowMenuComponent implements OnInit, OnDestroy {

  @Input() public dataManager: DataManager;

  left: number;
  top: number;
  isVisible: boolean;
  selectContainerClicked: boolean;

  @HostBinding('class') cssClass = 'dt-dropdown row-menu';

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

  private row: Row;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef, private element: ElementRef) {
  }

  ngOnInit() {
    const subScroll = this.dataManager.events.scrollSource$.subscribe(() => {
      if (this.isVisible) {
        this.isVisible = false;
        this.cd.detectChanges();
      }
    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
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

  getPositionMenu(left: number, top: number) {
    const menu = this.element.nativeElement;
    const {height, width} = this.getHiddenElementOuterSizes(menu);
    // flip
    if (left + width - window.pageXOffset > window.innerWidth) {
      left -= width;
    }
    // flip
    if (top + height - window.pageYOffset > window.innerHeight) {
      top -= height + this.dataManager.dimensions.rowHeight;
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
    if (!this.isVisible && this.dataManager.actionMenu.length > 0) {
      this.isVisible = true;
    }
  }

  closeDropdown() {
    if (this.isVisible) {
      this.isVisible = false;
      this.cd.markForCheck();
    }
  }

  show(event: RowMenuEventArgs) {
    this.row = event.row;
    this.selectContainerClicked = true;
    const coords = this.getPositionMenu(event.left, event.top);

    if (this.top === coords.top && this.left === coords.left) {
      this.isVisible ? this.closeDropdown() : this.openDropdown();
    } else {
      this.top = coords.top;
      this.left = coords.left;
      this.closeDropdown();
      this.openDropdown();
    }
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
      item.command(this.row);
    }
    this.isVisible = false;
  }

}
