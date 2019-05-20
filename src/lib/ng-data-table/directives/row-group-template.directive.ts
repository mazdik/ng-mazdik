import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[dtRowGroupTemplate]' })
export class RowGroupTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}
