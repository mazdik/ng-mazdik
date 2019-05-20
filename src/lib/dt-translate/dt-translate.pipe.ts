import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { DtTranslateService } from './dt-translate.service';

@Pipe({
  name: 'dtTranslate',
  pure: false
})
export class DtTranslatePipe implements PipeTransform {

  value: string = '';

  constructor(private translate: DtTranslateService, private cd: ChangeDetectorRef) {}

  transform(key: any): any {
    this.translate.get(key).subscribe(res => {
      this.value = res;
      this.cd.markForCheck();
    });
    this.translate.onLangChange.subscribe(() => {
      this.cd.markForCheck();
    });
    return this.value;
  }

}
