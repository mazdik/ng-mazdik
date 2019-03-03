import {ChangeDetectorRef, HostListener} from '@angular/core';

export class Dropdown {

  isOpen: boolean;
  selectContainerClicked: boolean;

  constructor(private cd: ChangeDetectorRef) {
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.selectContainerClicked = true;
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

  toggleDropdown() {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  openDropdown() {
    if (!this.isOpen) {
      this.isOpen = true;
    }
  }

  closeDropdown() {
    if (this.isOpen) {
      this.isOpen = false;
      this.cd.markForCheck();
    }
  }

}
