import {
  Component, ElementRef, ViewChild, Input, Output, OnInit, AfterViewChecked,
  HostListener, HostBinding, EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewChecked {

  @Input() public modalTitle: string;
  @Input() width: any;
  @Input() zIndex: number = 0;
  @Input() autoZIndex: boolean;

  @Output() close: EventEmitter<any> = new EventEmitter();

  @ViewChild('modalRoot') modalRoot: ElementRef;
  @ViewChild('modalBody') modalBody: ElementRef;

  @HostBinding('class') cssClass = 'app-modal';

  public visible: boolean = false;
  executePostDisplayActions: boolean;
  dragging: boolean;
  resizingS: boolean;
  resizingE: boolean;
  resizingSE: boolean;
  lastPageX: number;
  lastPageY: number;
  minWidth: number = 250;
  minHeight: number = 250;

  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    if (this.autoZIndex) {
      this.zIndex = this.getMaxModalIndex() + 1;
    } else {
      this.zIndex = this.zIndex || 1100;
    }
  }

  ngAfterViewChecked() {
    if (this.executePostDisplayActions) {
      this.center();
      this.executePostDisplayActions = false;
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.executePostDisplayActions = true;
    this.center();
  }

  @HostListener('keydown.esc', ['$event'])
  onKeyDown(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide();
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event): void {
    this.onDrag(event);
    this.onResize(event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event): void {
    this.endDrag(event);
    this.endResize(event);
  }

  public show(): void {
    this.executePostDisplayActions = true;
    this.visible = true;
    setTimeout(() => {
      this.modalRoot.nativeElement.focus();
    }, 1);
  }

  public hide(): void {
    this.visible = false;
    this.close.emit();
    this.focusLastModal();
  }

  get contentzIndex(): number {
    return this.zIndex + 1;
  }

  center() {
    let elementWidth = this.modalRoot.nativeElement.offsetWidth;
    let elementHeight = this.modalRoot.nativeElement.offsetHeight;

    if (elementWidth === 0 && elementHeight === 0) {
      this.modalRoot.nativeElement.style.visibility = 'hidden';
      this.modalRoot.nativeElement.style.display = 'block';
      elementWidth = this.modalRoot.nativeElement.offsetWidth;
      elementHeight = this.modalRoot.nativeElement.offsetHeight;
      this.modalRoot.nativeElement.style.display = 'none';
      this.modalRoot.nativeElement.style.visibility = 'visible';
    }

    const x = Math.max((window.innerWidth - elementWidth) / 2, 0);
    const y = Math.max((window.innerHeight - elementHeight) / 2, 0);

    this.modalRoot.nativeElement.style.left = x + 'px';
    this.modalRoot.nativeElement.style.top = y + 'px';
  }

  initDrag(event: MouseEvent) {
    this.dragging = true;
    this.lastPageX = event.pageX;
    this.lastPageY = event.pageY;
    this.modalRoot.nativeElement.classList.add('dragging');
  }

  onDrag(event: MouseEvent) {
    if (this.dragging) {
      const deltaX = event.pageX - this.lastPageX;
      const deltaY = event.pageY - this.lastPageY;
      const leftPos = parseInt(this.modalRoot.nativeElement.style.left, 10);
      const topPos = parseInt(this.modalRoot.nativeElement.style.top, 10);

      this.modalRoot.nativeElement.style.left = leftPos + deltaX + 'px';
      this.modalRoot.nativeElement.style.top = topPos + deltaY + 'px';

      this.lastPageX = event.pageX;
      this.lastPageY = event.pageY;
    }
  }

  endDrag(event: MouseEvent) {
    this.dragging = false;
    this.modalRoot.nativeElement.classList.remove('dragging');
  }

  initResizeS(event: MouseEvent) {
    this.resizingS = true;
    this.lastPageX = event.pageX;
    this.lastPageY = event.pageY;
    this.modalRoot.nativeElement.classList.add('resizing');
  }

  initResizeE(event: MouseEvent) {
    this.resizingE = true;
    this.lastPageX = event.pageX;
    this.lastPageY = event.pageY;
    this.modalRoot.nativeElement.classList.add('resizing');
  }

  initResizeSE(event: MouseEvent) {
    this.resizingSE = true;
    this.lastPageX = event.pageX;
    this.lastPageY = event.pageY;
    this.modalRoot.nativeElement.classList.add('resizing');
  }

  onResize(event: MouseEvent) {
    if (this.resizingS || this.resizingE || this.resizingSE) {
      const deltaX = event.pageX - this.lastPageX;
      const deltaY = event.pageY - this.lastPageY;
      const containerWidth = this.modalRoot.nativeElement.offsetWidth;
      const containerHeight = this.modalRoot.nativeElement.offsetHeight;
      const contentHeight = this.modalBody.nativeElement.offsetHeight;
      const newWidth = containerWidth + deltaX;
      const newHeight = containerHeight + deltaY;

      if (this.resizingSE || this.resizingE) {
        if (newWidth > this.minWidth) {
          this.modalRoot.nativeElement.style.width = newWidth + 'px';
        }
      }

      if (this.resizingSE || this.resizingS) {
        if (newHeight > this.minHeight) {
          this.modalRoot.nativeElement.style.height = newHeight + 'px';
          this.modalBody.nativeElement.style.height = contentHeight + deltaY + 'px';
          this.modalBody.nativeElement.style.maxHeight = 'none';
        }
      }

      this.lastPageX = event.pageX;
      this.lastPageY = event.pageY;
    }
  }

  endResize(event: MouseEvent) {
    this.resizingS = false;
    this.resizingE = false;
    this.resizingSE = false;
    this.modalRoot.nativeElement.classList.remove('resizing');
  }

  calcBodyHeight() {
    const windowHeight = window.innerHeight;
    if (this.modalRoot.nativeElement.offsetWidth > windowHeight) {
      this.modalBody.nativeElement.style.height = (windowHeight * .75) + 'px';
    }
  }

  getMaxModalIndex() {
    let zIndex = 0;
    const modals = document.querySelectorAll('.ui-modal-overlay');
    [].forEach.call(modals, function (modal) {
      const indexCurrent = parseInt(modal.style.zIndex, 10);
      if (indexCurrent > zIndex) {
        zIndex = indexCurrent;
      }
    });
    return zIndex;
  }

  focusLastModal() {
    const modal = this.findAncestor(this.element.nativeElement, 'app-modal');
    if (modal && modal.children[1]) {
      modal.children[1].focus();
    }
  }

  findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls)) {
    }
    return el;
  }

}
