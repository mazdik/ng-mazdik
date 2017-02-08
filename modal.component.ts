import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: 'app-modal',
    template: `
  <div class="modal fade" tabindex="-1" role="dialog" 
  		#modalRoot
  		(click)="static ? hide() : 0" 
  		(keydown.esc)="hide()" 
  		[ngClass]="{'in': visibleAnimate}" 
    	[ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog" (click)="preventClosing($event)">
      <div class="modal-content">
        <div class="modal-header">
          <ng-content select=".app-modal-header"></ng-content>
        </div>
        <div class="modal-body">
          <ng-content select=".app-modal-body"></ng-content>
        </div>
        <div class="modal-footer">
          <ng-content select=".app-modal-footer"></ng-content>
        </div>
      </div>
    </div>
  </div>
  `,
    styles: ['.modal { background-color: rgba(0,0,0,0.5); } .modal-body{ max-height: calc(100vh - 200px); overflow-y: auto; }'],
})
export class ModalComponent {

    @ViewChild("modalRoot")
    public modalRoot: ElementRef;

    public visible: boolean = false;
    private visibleAnimate: boolean = false;
    public static: boolean = false;

    public show(): void {
        this.visible = true;
        setTimeout(() => {
            this.visibleAnimate = true;
            this.modalRoot.nativeElement.focus()
        });
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }

    public preventClosing(event: MouseEvent) {
        event.stopPropagation();
    }

}
