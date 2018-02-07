import {PipeTransform, Pipe} from '@angular/core';
import {SelectOption} from '../types';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(options: SelectOption[], args: string): SelectOption[] {
    options = options || [];
    return options.filter((option: SelectOption) =>
      option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1);
  }
}
