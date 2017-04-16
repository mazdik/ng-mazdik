import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.css']
})
export class ModalComponent {

    @ViewChild("modalRoot")
    public modalRoot: ElementRef;

    public visible: boolean = false;
    public visibleAnimate: boolean = false;
    public static: boolean = false;

    public show(): void {
        this.visible = true;
        setTimeout(() => {
            this.visibleAnimate = true;
            this.modalRoot.nativeElement.focus()
        }, 1);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visible = false, 300);
    }

    public preventClosing(event: MouseEvent) {
        event.stopPropagation();
    }

}
