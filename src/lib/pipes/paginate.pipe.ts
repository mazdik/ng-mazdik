import {Pipe, PipeTransform, NgModule} from '@angular/core';
import {arrayPaginate} from '../common/utils';

@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {

  transform(array: any[], itemsPerPage: number, currentPage: number): any[] {
    return arrayPaginate(array, currentPage, itemsPerPage);
  }
}

@NgModule({
  declarations: [PaginatePipe],
  exports: [PaginatePipe],
})
export class PaginatePipeModule {}
