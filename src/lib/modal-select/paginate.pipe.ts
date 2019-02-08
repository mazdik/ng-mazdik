import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {

  transform(array: any[], itemsPerPage: number, currentPage: number): any[] {
    if (!array || !itemsPerPage || !currentPage) {
      return array;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = itemsPerPage > -1 ? (start + itemsPerPage) : array.length;
    return array.slice(start, end);
  }
}
