import { Base64Image, ErrorPicture } from './drop-image/base64.image.model';
import { Component } from '@angular/core';

@Component({
  selector: 'pluri-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-drop-image';

  whenChange(image: Base64Image): void {
    console.log('image changed', image);
  }

  whenError(error: ErrorPicture): void {
    console.log('error picture', error);
  }
}
