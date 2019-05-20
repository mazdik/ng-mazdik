import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[dtRowActionTemplate]' })
export class RowActionTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}
