import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-demo',
  template: `
    <button class="dt-button" (click)="modalRoot.show()">Open modal</button>
    <app-modal #modalRoot
               [maximizable]="true"
               (closeModal)="onCloseModal()">
      <ng-container class="app-modal-header">Demo modal</ng-container>
      <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
      </ng-container>
      <ng-container class="app-modal-footer">
        <button class="dt-button dt-red">Delete</button>&nbsp;
        <button class="dt-button dt-green">Save</button>
        <button class="dt-button dt-blue" style="float: right;" (click)="modalRoot.hide()">Close</button>
      </ng-container>
    </app-modal>
  `,
})
export class ModalDemoComponent {

  onCloseModal() {}

}
