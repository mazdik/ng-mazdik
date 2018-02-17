import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  public state: string = 'basic-demo';

  getSourceLink() {
    const link: string = 'https://github.com/mazdik/ng-crud-table/blob/master/src/app/demo/';
    return link + this.state + '.component.ts';
  }

}
