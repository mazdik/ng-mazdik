import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[dtHeaderTemplate]' })
export class HeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}
