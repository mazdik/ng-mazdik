import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[dt-header-template]' })
export class HeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) { }
}
