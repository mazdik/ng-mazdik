import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'dateFormatPipe'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return super.transform(value, 'dd.MM.yyyy hh:mm:ss');
  }

}
