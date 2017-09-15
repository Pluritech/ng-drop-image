import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DropImageModule } from './drop-image/index';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DropImageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
