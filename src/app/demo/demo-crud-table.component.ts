import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-demo-crud-table',
  template: `
    <div class="dt-row">
      <div class="dt-col-left">
        <h3 class="title">Demo crud data table</h3>
        <ul class="list-menu lg">
          <li><span (click)="state='basic-demo'" [ngClass]="{'active': state === 'basic-demo'}">Basic</span></li>
          <li><span (click)="state='tree-table-demo'" [ngClass]="{'active': state === 'tree-table-demo'}">Tree table</span>
          </li>
          <li><span (click)="state='data-table-demo'" [ngClass]="{'active': state === 'data-table-demo'}">Data table</span>
          </li>
          <li><span (click)="state='master-detail-demo'" [ngClass]="{'active': state === 'master-detail-demo'}">Master detail</span>
          </li>
          <li><span (click)="state='modal-form-demo'" [ngClass]="{'active': state === 'modal-form-demo'}">Modal form</span>
          </li>
          <li><span (click)="state='modal-data-table-demo'" [ngClass]="{'active': state === 'modal-data-table-demo'}">
            Modal data table</span>
          </li>
          <li><span (click)="state='nested-modals-demo'" [ngClass]="{'active': state === 'nested-modals-demo'}">
            Nested modals</span>
          </li>
          <li><span (click)="state='row-group-demo'" [ngClass]="{'active': state === 'row-group-demo'}">
            Row group</span>
          </li>
          <li><span (click)="state='row-group-multiple-demo'" [ngClass]="{'active': state === 'row-group-multiple-demo'}">
            Row group multiple</span>
          </li>
        </ul>
      </div>
      <div class="dt-col-right">
        <h3 class="title"><a [attr.href]="getSourceLink()" target="_blank">Source</a></h3>
        <app-basic-demo *ngIf="state === 'basic-demo'"></app-basic-demo>
        <app-tree-table-demo *ngIf="state === 'tree-table-demo'"></app-tree-table-demo>
        <app-data-table-demo *ngIf="state === 'data-table-demo'"></app-data-table-demo>
        <app-master-detail-demo *ngIf="state === 'master-detail-demo'"></app-master-detail-demo>
        <app-modal-form-demo *ngIf="state === 'modal-form-demo'"></app-modal-form-demo>
        <app-modal-data-table-demo *ngIf="state === 'modal-data-table-demo'"></app-modal-data-table-demo>
        <app-nested-modals-demo *ngIf="state === 'nested-modals-demo'"></app-nested-modals-demo>
        <app-row-group-demo *ngIf="state === 'row-group-demo'"></app-row-group-demo>
        <app-row-group-multiple-demo *ngIf="state === 'row-group-multiple-demo'"></app-row-group-multiple-demo>
      </div>
    </div>
  `,
  styleUrls: ['./demo-crud-table.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoCrudTableComponent {

  public state: string = 'basic-demo';

  getSourceLink() {
    const link: string = 'https://github.com/mazdik/ng-crud-table/blob/master/src/app/demo/';
    return link + this.state + '.component.ts';
  }

}
