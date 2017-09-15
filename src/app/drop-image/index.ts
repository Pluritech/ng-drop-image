import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropImageComponent } from './drop-image/drop-image.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DropImageComponent],
  exports: [DropImageComponent]
})
export class DropImageModule { }
