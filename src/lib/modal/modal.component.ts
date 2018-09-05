import {
  Component, ElementRef, ViewChild, Input, Output, OnInit, AfterViewChecked, NgZone,
  HostListener, HostBinding, EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewChecked {

  @Input() modalTitle: string;
  @Input() width: any;
  @Input() zIndex: number;
  @Input() minWidth: number = 260;
  @Input() minHeight: number = 200;
  @Input() scrollTop: boolean = true;
  @Input() maximizable: boolean;
  @Input() backdrop: boolean = true;
  @Input() styleClass: string;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('modalRoot') modalRoot: ElementRef;
  @ViewChild('modalBody') modalBody: ElementRef;
  @ViewChild('modalHeader') modalHeader: ElementRef;
  @ViewChild('modalFooter') modalFooter: ElementRef;

  @HostBinding('class')
  get cssClass(): string {
    let cls = 'app-modal';
    if (this.styleClass) {
      cls += ' ' + this.styleClass;
    }
    return cls;
  }

  visible: boolean;
  contentzIndex: number;
  executePostDisplayActions: boolean;
  dragging: boolean;
  resizingS: boolean;
  resizingE: boolean;
  resizingSE: boolean;
  lastPageX: number;
  lastPageY: number;
  maximized: boolean;
  preMaximizeRootWidth: number;
  preMaximizeRootHeight: number;
  preMaximizeBodyHeight: number;
  preMaximizePageX: number;
  preMaximizePageY: number;

  constructor(private element: ElementRef, private ngZone: NgZone) {
  }

  ngOnInit() {
    if (!this.zIndex) {
      this.zIndex = this.getMaxModalIndex() + 1;
      this.zIndex = this.zIndex || 1100;
    }
    this.contentzIndex = this.zIndex + 1;
  }

  ngAfterViewChecked() {
    if (this.executePostDisplayActions) {
      this.center();
      this.executePostDisplayActions = false;
    }
  }

  addEventListeners() {
    this.ngZone.runOutsideAngular(() => {
      window.document.addEventListener('mousemove', this.onMousemove.bind(this));
      window.document.addEventListener('mouseup', this.onMouseup.bind(this));
      window.addEventListener('resize', this.onWindowResize.bind(this));

      window.document.addEventListener('touchmove', this.onTouchmove.bind(this), false);
      window.document.addEventListener('touchend', this.onTouchend.bind(this), false);
    });
  }

  removeEventListener() {
    window.document.removeEventListener('mousemove', this.onMousemove.bind(this));
    window.document.removeEventListener('mouseup', this.onMouseup.bind(this));
    window.removeEventListener('resize', this.onWindowResize.bind(this));

    window.document.removeEventListener('touchmove', this.onTouchmove.bind(this));
    window.document.removeEventListener('touchend', this.onTouchend.bind(this));
  }

  @HostListener('keydown.esc', ['$event'])
  onKeyDown(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide();
  }

  onWindowResize(): void {
    this.executePostDisplayActions = true;
    this.center();
  }

  onMousemove(event: MouseEvent): void {
    this.onDrag(event.pageX, event.pageY);
    this.onResize(event.pageX, event.pageY);
  }

  onMouseup(): void {
    this.endDrag();
    this.endResize();
  }

  onTouchmove(event: TouchEvent): void {
    const touch = event.touches[0];
    this.onDrag(touch.pageX, touch.pageY);
    this.onResize(touch.pageX, touch.pageY);
  }

  onTouchend(): void {
    this.endDrag();
    this.endResize();
  }

  show(): void {
    this.executePostDisplayActions = true;
    this.visible = true;
    setTimeout(() => {
      this.modalRoot.nativeElement.focus();
      if (this.scrollTop) {
        this.modalBody.nativeElement.scrollTop = 0;
      }
    }, 1);
    this.addEventListeners();
  }

  hide(): void {
    this.visible = false;
    this.close.emit(true);
    this.focusLastModal();
    this.removeEventListener();
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

  initDrag(pageX: number, pageY: number) {
    if (!this.maximized) {
      this.dragging = true;
      this.lastPageX = pageX;
      this.lastPageY = pageY;
      this.modalRoot.nativeElement.classList.add('dragging');
    }
  }

  onDrag(pageX: number, pageY: number) {
    if (this.dragging) {
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
      const leftPos = parseFloat(this.modalRoot.nativeElement.style.left);
      const topPos = parseFloat(this.modalRoot.nativeElement.style.top);

      this.modalRoot.nativeElement.style.left = leftPos + deltaX + 'px';
      this.modalRoot.nativeElement.style.top = topPos + deltaY + 'px';

      this.lastPageX = pageX;
      this.lastPageY = pageY;
    }
  }

  endDrag() {
    this.dragging = false;
    this.modalRoot.nativeElement.classList.remove('dragging');
  }

  initResizeS(pageX: number, pageY: number) {
    this.resizingS = true;
    this.lastPageX = pageX;
    this.lastPageY = pageY;
    this.modalRoot.nativeElement.classList.add('resizing');
  }

  initResizeE(pageX: number, pageY: number) {
    this.resizingE = true;
    this.lastPageX = pageX;
    this.lastPageY = pageY;
    this.modalRoot.nativeElement.classList.add('resizing');
  }

  initResizeSE(pageX: number, pageY: number) {
    this.resizingSE = true;
    this.lastPageX = pageX;
    this.lastPageY = pageY;
    this.modalRoot.nativeElement.classList.add('resizing');
  }

  onResize(pageX: number, pageY: number) {
    if (this.resizingS || this.resizingE || this.resizingSE) {
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
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

      this.lastPageX = pageX;
      this.lastPageY = pageY;
    }
  }

  endResize() {
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
    const modals = document.querySelectorAll('.ui-modal');
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

  onCloseIcon(event: Event) {
    event.stopPropagation();
  }

  toggleMaximize(event) {
    if (this.maximized) {
      this.revertMaximize();
    } else {
      this.maximize();
    }
    event.preventDefault();
  }

  maximize() {
    this.preMaximizePageX = parseFloat(this.modalRoot.nativeElement.style.top);
    this.preMaximizePageY = parseFloat(this.modalRoot.nativeElement.style.left);
    this.preMaximizeRootWidth = this.modalRoot.nativeElement.offsetWidth;
    this.preMaximizeRootHeight = this.modalRoot.nativeElement.offsetHeight;
    this.preMaximizeBodyHeight = this.modalBody.nativeElement.offsetHeight;

    this.modalRoot.nativeElement.style.top = '0px';
    this.modalRoot.nativeElement.style.left = '0px';
    this.modalRoot.nativeElement.style.width = '100vw';
    this.modalRoot.nativeElement.style.height = '100vh';
    const diffHeight = this.modalHeader.nativeElement.offsetHeight + this.modalFooter.nativeElement.offsetHeight;
    this.modalBody.nativeElement.style.height = 'calc(100vh - ' + diffHeight + 'px)';
    this.modalBody.nativeElement.style.maxHeight = 'none';

    this.maximized = true;
  }

  revertMaximize() {
      this.modalRoot.nativeElement.style.top = this.preMaximizePageX + 'px';
      this.modalRoot.nativeElement.style.left = this.preMaximizePageY + 'px';
      this.modalRoot.nativeElement.style.width = this.preMaximizeRootWidth + 'px';
      this.modalRoot.nativeElement.style.height = this.preMaximizeRootHeight + 'px';
      this.modalBody.nativeElement.style.height = this.preMaximizeBodyHeight + 'px';

      this.maximized = false;
  }

  moveOnTop() {
    if (!this.backdrop) {
      const zIndex = this.getMaxModalIndex();
      if (this.contentzIndex <= zIndex) {
        this.contentzIndex = zIndex + 1;
      }
    }
  }

}
