import { Keys } from '../common';
import { Subject } from 'rxjs';

export class DropDown {

  isOpen: boolean;
  selectContainerClicked: boolean;

  private isOpenSource = new Subject<boolean>();
  isOpenSource$ = this.isOpenSource.asObservable();

  private clickListener: any;
  private windowClickListener: any;
  private windowKeydownListener: any;

  constructor(private element: HTMLElement) {
    this.addEventListeners();
  }

  addEventListeners(): void {
    this.clickListener = this.onClick.bind(this);
    this.element.addEventListener('click', this.clickListener);

    this.windowClickListener = this.onWindowClick.bind(this);
    window.document.addEventListener('click', this.windowClickListener);

    this.windowKeydownListener = this.onKeyDown.bind(this);
    window.document.addEventListener('keydown', this.windowKeydownListener);
  }

  removeEventListeners(): void {
    this.element.removeEventListener('click', this.clickListener);
    window.document.removeEventListener('click', this.windowClickListener);
    window.document.removeEventListener('keydown', this.windowKeydownListener);
  }

  onClick(event: MouseEvent): void {
    this.selectContainerClicked = true;
  }

  onWindowClick(event: MouseEvent): void {
    if (!this.selectContainerClicked) {
      this.closeDropdown();
    }
    this.selectContainerClicked = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === Keys.ESCAPE || event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  toggleDropdown(): void {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  openDropdown(): void {
    if (!this.isOpen) {
      this.isOpen = true;
      this.isOpenSource.next(this.isOpen);
    }
  }

  closeDropdown(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.isOpenSource.next(this.isOpen);
    }
  }

}
