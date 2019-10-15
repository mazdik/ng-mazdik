import {
  Component, ElementRef, ViewChild, Input, Output, OnInit, AfterViewChecked, HostListener, HostBinding, EventEmitter, ViewEncapsulation
} from '@angular/core';
import {ResizableEvent} from '../resizable/types';
import {maxZIndex, findAncestor} from '../common/utils';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css', '../styles/resizable.css'],
  encapsulation: ViewEncapsulation.None,
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

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('modalRoot', {static: false}) modalRoot: ElementRef;
  @ViewChild('modalBody', {static: false}) modalBody: ElementRef;
  @ViewChild('modalHeader', {static: false}) modalHeader: ElementRef;
  @ViewChild('modalFooter', {static: false}) modalFooter: ElementRef;

  @HostBinding('class.app-modal') cssClass = true;

  visible: boolean;
  contentzIndex: number;
  executePostDisplayActions: boolean;
  maximized: boolean;
  preMaximizeRootWidth: number;
  preMaximizeRootHeight: number;
  preMaximizeBodyHeight: number;
  preMaximizePageX: number;
  preMaximizePageY: number;
  dragEventTarget: MouseEvent | TouchEvent;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    if (!this.zIndex) {
      this.zIndex = this.getMaxModalIndex();
      this.zIndex = (this.zIndex || 1000) + 1;
    }
    this.contentzIndex = this.zIndex + 1;
  }

  ngAfterViewChecked() {
    if (this.executePostDisplayActions) {
      this.center();
      this.executePostDisplayActions = false;
    }
  }

  @HostListener('keydown.esc', ['$event'])
  onKeyDown(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hide();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.executePostDisplayActions = true;
    this.center();
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
  }

  hide(): void {
    this.visible = false;
    this.closeModal.emit(true);
    this.focusLastModal();
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

  initDrag(event: MouseEvent | TouchEvent) {
    if (!this.maximized) {
      this.dragEventTarget = event;
    }
  }

  onResize(event: ResizableEvent) {
    if (event.direction === 'vertical') {
      this.calcBodyHeight();
    }
  }

  calcBodyHeight() {
    const diffHeight = this.modalHeader.nativeElement.offsetHeight + this.modalFooter.nativeElement.offsetHeight;
    const contentHeight = this.modalRoot.nativeElement.offsetHeight - diffHeight;
    this.modalBody.nativeElement.style.height = contentHeight + 'px';
    this.modalBody.nativeElement.style.maxHeight = 'none';
  }

  getMaxModalIndex() {
    return maxZIndex('.ui-modal');
  }

  focusLastModal() {
    const modal = findAncestor(this.element.nativeElement.parentElement, 'app-modal');
    if (modal && modal.children[1]) {
      modal.children[1].focus();
    }
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

  get dialogStyles() {
    return {
      display: this.visible ? 'block' : 'none',
      'z-index': this.contentzIndex,
      'width.px': this.width,
      'min-width.px': this.minWidth,
    };
  }

  get overlayStyles() {
    return {
      display: (this.visible && this.backdrop) ? 'block' : 'none',
      'z-index': this.zIndex,
    };
  }

}
