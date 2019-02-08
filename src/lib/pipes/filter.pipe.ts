import {Pipe, PipeTransform, NgModule} from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterPipe implements PipeTransform {

  transform(array: any[], field: string, filter: string): any[] {
    if (!array || !field) {
      return array;
    }
    return array.filter(val =>
      val[field].toLowerCase().indexOf((filter || '').toLowerCase()) > -1);
  }
}

@NgModule({
  declarations: [FilterPipe],
  exports: [FilterPipe],
})
export class FilterPipeModule {}
