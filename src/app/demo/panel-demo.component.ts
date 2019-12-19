import { Component } from '@angular/core';

@Component({
  selector: 'app-panel-demo',
  template: `
  <button class="dt-button" (click)="modal1.show()">Open panel 1</button>&nbsp;
  <button class="dt-button" (click)="modal2.show()">Open panel 2</button>&nbsp;
  <button class="dt-button" (click)="modal3.show()">Open panel 2</button>&nbsp;
    <app-modal #modal1
               class="panel-demo1"
               [maximizable]="true"
               [backdrop]="false">
      <ng-container class="app-modal-header">Panel 1</ng-container>
      <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
      </ng-container>
      <ng-container class="app-modal-footer">
        <button class="dt-button dt-red">Delete</button>&nbsp;
        <button class="dt-button dt-green">Save</button>
        <button class="dt-button dt-blue" style="float: right;" (click)="modal1.hide()">Close</button>
      </ng-container>
    </app-modal>
    <app-modal #modal2
               class="panel-demo2"
               [maximizable]="true"
               [backdrop]="false">
      <ng-container class="app-modal-header">Panel 2</ng-container>
      <ng-container class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
      </ng-container>
      <ng-container class="app-modal-footer">
        <button class="dt-button dt-red">Delete</button>&nbsp;
        <button class="dt-button dt-green">Save</button>
        <button class="dt-button dt-blue" style="float: right;" (click)="modal2.hide()">Close</button>
      </ng-container>
    </app-modal>
    <app-modal #modal3
               class="panel-demo3"
               [maximizable]="true"
               [backdrop]="false">
      <ng-container class="app-modal-header">Panel 3</ng-container>
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
  `,
})
export class PanelDemoComponent {

}
