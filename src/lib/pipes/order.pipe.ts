import {Pipe, PipeTransform, NgModule} from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: false
})
export class OrderPipe implements PipeTransform {

  transform(array: any[], field: string, reverse?: boolean): any[] {
    if (!array || !field) {
      return array;
    }
    array.sort((a, b) => (a[field] > b[field]) ? 1 : (a[field] < b[field]) ? -1 : 0);
    return (reverse === false) ? array.reverse() : array;
  }
}

@NgModule({
  declarations: [OrderPipe],
  exports: [OrderPipe],
})
export class OrderPipeModule {}
