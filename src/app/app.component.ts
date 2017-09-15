import { Base64Image, ErrorPicture } from './drop-image/base64.image.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pluri-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-drop-image';

  public myUpdatedImageList: Base64Image[] = [];
  public myServerImageList: any[] = [];
  ngOnInit() {
    fetch('https://randomuser.me/api/?results=4')
    .then(data => data.json())
    .then(data => data.results)
    .then(data => this.myServerImageList = data.map(person => {
      return {main: false, path: person.picture.large}
    }));
  }

  whenChange(image: Base64Image): void {
    console.log('image changed', image);
  }

  whenError(error: ErrorPicture): void {
    console.log('error picture', error);
  }

  whenUpdateLocalList(list: Base64Image[]): void {
    console.log('list updated', list);
  }

  whenLocalImageSetAsMain(image: Base64Image): void {
    console.log('image to set as main', image);
    image.main = true;
  }

  whenLocalImageDelete(image: Base64Image): void {
    console.log('image to delete', image);
    const index = this.myUpdatedImageList.indexOf(image);
    this.myUpdatedImageList.splice(index, 1);
  }

  whenServerImageSetAsMain(image: any): void {
    console.log('image to set as main in server', image);
    image.main = true;
  }

  whenServerImageDelete(image: any): void {
    console.log('image to delete in server', image);
  }
}
