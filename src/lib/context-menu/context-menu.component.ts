import {Component, OnInit, Input, ViewChild, HostListener} from '@angular/core';
import {MenuItem} from './types';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['../styles/context-menu.css']
})
export class ContextMenuComponent implements OnInit {

  @Input() items: MenuItem[];

  @ViewChild('menu') menu: any;
  isVisible: boolean;
  selectContainerClicked: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  positionMenu(event) {
    let left = event.pageX + 1;
    let top = event.pageY + 1;
    const menu = this.menu.nativeElement;
    const width = menu.offsetParent ? menu.offsetWidth : this.getHiddenElementOuterWidth(menu);
    const height = menu.offsetParent ? menu.offsetHeight : this.getHiddenElementOuterHeight(menu);
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

  show(event: MouseEvent) {
    this.positionMenu(event);
    this.isVisible = true;
    event.preventDefault();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.selectContainerClicked = true;
    if (this.isVisible && event.button !== 2) {
      this.isVisible = false;
    }
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    if (!this.selectContainerClicked) {
      this.isVisible = false;
    }
    this.selectContainerClicked = false;
  }

  @HostListener('keydown.esc', ['$event'])
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
      item.command({
        originalEvent: event,
        item: item
      });
    }
  }

}
