import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[oblivionBorder]',
})
export class BorderDirective {
  constructor(private el: ElementRef<HTMLElement>) {
    this.el.nativeElement.style.border='1px solid black'
  }
}
