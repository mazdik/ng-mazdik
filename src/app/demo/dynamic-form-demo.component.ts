import { Component } from '@angular/core';
import { DynamicFormElement, GetOptionsFunc, ColumnBase } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-form-demo',
  template: `
  <app-dynamic-form class="dynamic-form-demo"
    [dynElements]="dynElements"
    [item]="item"
    [isNewItem]="isNewItem"
    [getOptionsFunc]="getOptionsFunc"
    [selectPlaceholder]="'Select...'"
    [searchInputPlaceholder]="'Search...'"
    (valid)="onFormValid($event)"
    (loaded)="onLoaded($event)">
  </app-dynamic-form>
  `,
})
export class DynamicFormDemoComponent {

  dynElements: DynamicFormElement[];
  isNewItem: boolean = true;
  getOptionsFunc: GetOptionsFunc;
  item: any = {};

  constructor(private http: HttpClient) {
    this.getOptionsFunc = this.getOptions.bind(this);

    const columns = getColumnsPlayers();
    columns[3].options = null;
    columns[3].optionsUrl = 'assets/options.json';
    columns[9].validatorFunc = this.customValidation;

    this.createDynamicFormElements(columns);
  }

  onFormValid(event) { }

  onLoaded(event) { }

  createDynamicFormElements(columns: ColumnBase[]) {
    const temp: DynamicFormElement[] = [];

    for (const column of columns) {
      const element = new DynamicFormElement();
      element.name = column.name;
      element.title = column.title;
      element.options = column.options;
      element.optionsUrl = column.optionsUrl;
      element.type = column.type;
      element.validatorFunc = column.validatorFunc;
      element.dependsElement = column.dependsColumn;
      element.cellTemplate = column.formTemplate ? column.formTemplate : column.cellTemplate;
      element.hidden = column.formHidden;
      element.keyElement = column.keyColumn;
      element.disableOnEdit = column.formDisableOnEdit;
      temp.push(element);
    }
    this.dynElements = temp;
  }

  customValidation(name: string, value: any): string[] {
    const errors = [];
    if (value == null || value.length === 0) {
      errors.push('Custom validator ' + name);
    }
    return errors;
  }

  getOptions(url: string, parentId: any): Promise<any> {
    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        const result = response.filter((value: any) => {
          return value.parentId === parentId;
        });
        return new Promise((resolve) => {
          setTimeout(() => resolve(result), 1000);
        });
      })
      .catch(err => console.log(err));
  }

}
