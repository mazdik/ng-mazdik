import { Component } from '@angular/core';

@Component({
  selector: 'app-nested-modal-demo',
  template: `
    <button class="dt-button" (click)="modalRoot.show()">Open modal</button>
    <app-modal #modalRoot class="nested-modal-demo1">
      <ng-container class="app-modal-header">Modal 1</ng-container>
      <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>

        <button class="dt-button" (click)="childModal.show()">Open modal</button>
        <app-modal #childModal class="nested-modal-demo2">
          <ng-container class="app-modal-header">Modal 2</ng-container>
          <ng-container class="app-modal-body">
            <h3>MODAL DIALOG</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>

              <button class="dt-button" (click)="modal3.show()">Open modal</button>
              <app-modal #modal3 class="nested-modal-demo3">
                <ng-container class="app-modal-header">Modal 3</ng-container>
                <ng-container class="app-modal-body">
                  <h3>MODAL DIALOG</h3>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
                </ng-container>
                <ng-container class="app-modal-footer">
                  <button class="dt-button dt-red">Delete</button>&nbsp;
                  <button class="dt-button dt-green">Save</button>
                  <button class="dt-button dt-blue" style="float: right;" (click)="modal3.hide()">Close</button>
                </ng-container>
              </app-modal>

          </ng-container>
          <ng-container class="app-modal-footer">
            <button class="dt-button dt-red">Delete</button>&nbsp;
            <button class="dt-button dt-green">Save</button>
            <button class="dt-button dt-blue" style="float: right;" (click)="childModal.hide()">Close
            </button>
          </ng-container>
        </app-modal>

      </ng-container>
      <ng-container class="app-modal-footer">
        <button class="dt-button dt-red">Delete</button>&nbsp;
        <button class="dt-button dt-green">Save</button>
        <button class="dt-button dt-blue" style="float: right;" (click)="modalRoot.hide()">Close</button>
      </ng-container>
    </app-modal>
  `,
})
export class NestedModalDemoComponent {

}
