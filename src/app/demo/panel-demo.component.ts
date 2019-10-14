import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-panel-demo',
  template: `
  <button type="button" class="dt-button" (click)="modal1.show()">Open panel 1</button>&nbsp;
  <button type="button" class="dt-button" (click)="modal2.show()">Open panel 2</button>&nbsp;
  <button type="button" class="dt-button" (click)="modal3.show()">Open panel 2</button>&nbsp;
    <app-modal #modal1
               class="modal1"
               [modalTitle]="'Panel 1'"
               [width]="500"
               [maximizable]="true"
               [backdrop]="false">
      <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
      </ng-container>
      <ng-container class="app-modal-footer">
        <button type="button" class="dt-button dt-red">Delete</button>&nbsp;
        <button type="button" class="dt-button dt-green">Save</button>
        <button type="button" class="dt-button dt-blue" style="float: right;" (click)="modal1.hide()">Close</button>
      </ng-container>
    </app-modal>
    <app-modal #modal2
               class="modal2"
               [modalTitle]="'Panel 2'"
               [width]="500"
               [maximizable]="true"
               [backdrop]="false">
      <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
      </ng-container>
      <ng-container class="app-modal-footer">
        <button type="button" class="dt-button dt-red">Delete</button>&nbsp;
        <button type="button" class="dt-button dt-green">Save</button>
        <button type="button" class="dt-button dt-blue" style="float: right;" (click)="modal2.hide()">Close</button>
      </ng-container>
    </app-modal>
    <app-modal #modal3
               class="modal3"
               [modalTitle]="'Panel 3'"
               [width]="500"
               [maximizable]="true"
               [backdrop]="false">
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
  `,
  styles: [`
  .modal1 .ui-modal-header { background-color: red !important; }
  .modal2 .ui-modal-header { background-color: #4CAF50 !important; }
  .modal3 .ui-modal-header { background-color: #ff9800 !important; }
  `],
  styleUrls: ['../../../dist/ng-mazdik-lib/styles/buttons.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PanelDemoComponent {

}
