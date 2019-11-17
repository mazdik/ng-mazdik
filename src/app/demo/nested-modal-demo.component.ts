import { Component } from '@angular/core';

@Component({
  selector: 'app-nested-modal-demo',
  template: `
    <button type="button" class="dt-button" (click)="modalRoot.show()">Open modal</button>
    <app-modal #modalRoot
               class="nested-modal-demo1"
               [modalTitle]="'Modal 1'"
               [zIndex]="zIndex">
      <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>

        <button type="button" class="dt-button" (click)="childModal.show()">Open modal</button>
        <app-modal #childModal
                   class="nested-modal-demo2"
                   [modalTitle]="'Modal 2'"
                   [zIndex]="zIndex+2">
          <ng-container class="app-modal-body">
            <h3>MODAL DIALOG</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>

              <button type="button" class="dt-button" (click)="modal3.show()">Open modal</button>
              <app-modal #modal3
                         class="nested-modal-demo3"
                         [modalTitle]="'Modal 3'"
                         [zIndex]="zIndex+4">
                <ng-container class="app-modal-body">
                  <h3>MODAL DIALOG</h3>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
                </ng-container>
                <ng-container class="app-modal-footer">
                  <button type="button" class="dt-button dt-red">Delete</button>&nbsp;
                  <button type="button" class="dt-button dt-green">Save</button>
                  <button type="button" class="dt-button dt-blue" style="float: right;" (click)="modal3.hide()">Close</button>
                </ng-container>
              </app-modal>

          </ng-container>
          <ng-container class="app-modal-footer">
            <button type="button" class="dt-button dt-red">Delete</button>&nbsp;
            <button type="button" class="dt-button dt-green">Save</button>
            <button type="button" class="dt-button dt-blue" style="float: right;" (click)="childModal.hide()">Close
            </button>
          </ng-container>
        </app-modal>

      </ng-container>
      <ng-container class="app-modal-footer">
        <button type="button" class="dt-button dt-red">Delete</button>&nbsp;
        <button type="button" class="dt-button dt-green">Save</button>
        <button type="button" class="dt-button dt-blue" style="float: right;" (click)="modalRoot.hide()">Close</button>
      </ng-container>
    </app-modal>
  `,
})
export class NestedModalDemoComponent {

  zIndex: number = 1;

}
