import {Component, ElementRef, ViewChild, Input, OnInit, AfterViewChecked, HostListener} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewChecked {

  @Input() public modalTitle: string;
  @Input() width: any;
  @Input() zIndex: number = 900;
  @ViewChild('modalRoot') modalRoot: ElementRef;

  public visible: boolean = false;
  executePostDisplayActions: boolean;
  dragging: boolean;
  lastPageX: number;
  lastPageY: number;

  constructor() { }

  ngOnInit() {
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

  @HostListener('keydown.esc')
  onKeyDown(): void {
    this.hide();
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event): void {
    this.onDrag(event);
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

}
