import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorderDirective } from './border.directive';


@NgModule({
  declarations: [BorderDirective],
  imports: [
    CommonModule
  ],
  exports: [BorderDirective]
})
export class BorderModule {
}
