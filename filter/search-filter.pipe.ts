import {PipeTransform, Pipe} from '@angular/core';
import {ISelectOption} from '../types/interfaces';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(options: ISelectOption[], args: string): ISelectOption[] {
    options = options || [];
    return options.filter((option: ISelectOption) =>
      option.name
        .toLowerCase()
        .indexOf((args || '').toLowerCase()) > -1);
  }
}
