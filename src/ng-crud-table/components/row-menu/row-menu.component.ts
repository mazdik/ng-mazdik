import {
  Component, OnInit, OnDestroy, Input, ViewChild, HostListener, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataManager, MenuItem, RowMenuEventArgs, Row} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-row-menu',
  templateUrl: './row-menu.component.html',
  styleUrls: ['./row-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowMenuComponent implements OnInit, OnDestroy {

  @Input() public dataManager: DataManager;

  @ViewChild('menu') menu: any;
  isVisible: boolean;
  selectContainerClicked: boolean;

  private row: Row;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    const subScroll = this.dataManager.events.scrollSource$.subscribe(() => {
      this.hide();
    });
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  positionMenu(left: number, top: number) {
    const menu = this.menu.nativeElement;
    const width = menu.offsetParent ? menu.offsetWidth : this.getHiddenElementOuterWidth(menu);
    const height = menu.offsetParent ? menu.offsetHeight : this.getHiddenElementOuterHeight(menu);
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
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }

  getHiddenElementOuterHeight(element: any): number {
      element.style.visibility = 'hidden';
      element.style.display = 'block';
      const elementHeight = element.offsetHeight;
      element.style.display = 'none';
      element.style.visibility = 'visible';

      return elementHeight;
  }

  getHiddenElementOuterWidth(element: any): number {
      element.style.visibility = 'hidden';
      element.style.display = 'block';
      const elementWidth = element.offsetWidth;
      element.style.display = 'none';
      element.style.visibility = 'visible';

      return elementWidth;
  }

  toggleDropdown() {
    this.isVisible ? this.closeDropdown() : this.openDropdown();
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

  show(data: RowMenuEventArgs) {
    this.row = data.row;
    this.selectContainerClicked = true;
    this.positionMenu(data.left, data.top);
    this.isVisible = true;
  }

  hide() {
    this.closeDropdown();
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    if (!this.selectContainerClicked) {
      this.isVisible = false;
    }
    this.selectContainerClicked = false;
  }

  @HostListener('window:keydown.esc', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.isVisible = false;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.isVisible = false;
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
