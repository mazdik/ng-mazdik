import {Component, OnInit, Input, ViewChild, HostListener} from '@angular/core';
import {MenuItem} from '../types/interfaces';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  @Input() items: MenuItem[];

  @ViewChild('menu') menu: any;
  isVisible: boolean = false;
  selectContainerClicked: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  getPosition(event) {
    let posx = 0;
    let posy = 0;

    if (event.pageX || event.pageY) {
      posx = event.pageX;
      posy = event.pageY;
    } else if (event.clientX || event.clientY) {
      posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {x: posx, y: posy};
  }

  positionMenu(event) {
    const menu = this.menu.nativeElement;
    const clickCoords = this.getPosition(event);
    const clickCoordsX = clickCoords.x;
    const clickCoordsY = clickCoords.y;

    const menuWidth = menu.offsetWidth + 4;
    const menuHeight = menu.offsetHeight + 4;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if ((windowWidth - clickCoordsX) < menuWidth) {
      menu.style.left = windowWidth - menuWidth + 'px';
    } else {
      menu.style.left = clickCoordsX + 'px';
    }

    if ((windowHeight - clickCoordsY) < menuHeight) {
      menu.style.top = windowHeight - menuHeight + 'px';
    } else {
      menu.style.top = clickCoordsY + 'px';
    }
  }

  show(event: MouseEvent) {
    this.positionMenu(event);
    this.isVisible = true;
    event.preventDefault();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.selectContainerClicked = true;
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    if (!this.selectContainerClicked) {
      this.isVisible = false;
    }
    this.selectContainerClicked = false;;
  }

  @HostListener('keydown.esc', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.isVisible = false;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.isVisible = false;
  }

}
