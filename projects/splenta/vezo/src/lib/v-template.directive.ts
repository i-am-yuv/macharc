import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[vTemplate]'
})
export class VTemplateDirective {

  @Input()
  type!: string;

  @Input('vTemplate')
  name!: string;

  constructor(public templateRef: TemplateRef<unknown>) { }

  getType(): string {
    return this.name;
  }

}
