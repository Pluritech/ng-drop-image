import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropImageComponent } from './drop-image/drop-image.component';

export * from './models/base64.image.model';
export * from './drop-image/drop-image.component';
export * from './utils/utils';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DropImageComponent],
  exports: [DropImageComponent]
})
export class DropImageModule { }
