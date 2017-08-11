import {Component, ViewEncapsulation} from '@angular/core';
import {Location, LocationStrategy, HashLocationStrategy} from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <h2 style="color: #5b9bd5">Demo crud data table</h2>
    <div class="row">
      <div class="col-md-2">
        <ul>
          <li><a href="#basic-demo" (click)="state=''">Basic demo</a></li>
          <li><a href="#tree-table-demo" (click)="state='tree-table-demo'">Tree table demo</a></li>
          <li><a href="#tree-filter-demo" (click)="state='tree-filter-demo'">Tree filter demo</a></li>
        </ul>
      </div>
      <div class="col-md-10">
        <basic-demo *ngIf="!state"></basic-demo>
        <tree-table-demo *ngIf="state === 'tree-table-demo'"></tree-table-demo>
        <tree-filter-demo *ngIf="state === 'tree-filter-demo'"></tree-filter-demo>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  providers: [
    Location, {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
})
export class AppComponent {

  _state: string;

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
  }

  constructor(location: Location) {
    this.state = location.path(true);
  }
}
