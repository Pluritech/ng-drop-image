import { isGif } from './../utils';
import { Base64Image, ErrorPicture } from './../base64.image.model';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as Flow from '@flowjs/flow.js'

@Component({
  selector: 'pluri-drop-image',
  templateUrl: './drop-image.component.html',
  styleUrls: ['./drop-image.component.css']
})
export class DropImageComponent implements OnInit {

  /** The text of 'select image' button */
  @Input() btnSelect: string;

  /** An boolean expression to show the error text */
  @Input() hasError: boolean;

  /** The error text */
  @Input() errorText: string;

  /** The default text, something like... 'Please, drop an image*/
  @Input() defaultText: string;

  /** An boolean to indicate if you want to work with a single image or multiple. Default is true*/
  @Input() singleImage = true;

  /** The path of an image to show in the template, it can be a base64 or a image url, only if you're using an single image */
  @Input() imagePath: string;

  /** Min width in pixels of any image inserted, default is null, so, every image will be accepted. */
  @Input() minWidth: number;

  /** Min heigth of any image inserted, default is null, so, every image will be accepted */
  @Input() minHeigth: number;

  /** An function to call when the image have changed, only if you're using an single image */
  @Output() onImageChange: EventEmitter<Base64Image> = new EventEmitter<Base64Image>();

  /** An function to call when has an error with the image */
  @Output() onError: EventEmitter<ErrorPicture> = new EventEmitter<ErrorPicture>();

  @Input() list1: [{}];
  @Output() onList1ImageSetAsMain: EventEmitter<any> = new EventEmitter<any>();
  @Output() onList1ImageDelete: EventEmitter<any> = new EventEmitter<any>();

  @Input() list2: [{}];
  @Output() onList2ImageSetAsMain: EventEmitter<any> = new EventEmitter<any>();
  @Output() onList2ImageDelete: EventEmitter<any> = new EventEmitter<any>();

  private flow: Flow.IFlow;
  public image: any;
  private dropAreaElement: any;
  private flowButtonElement: any;
  constructor() { }

  ngOnInit() {
    this._initFlow();
  }

  private _initFlow(): void {
    this.flow = new Flow({
      accept: 'image/*'
    });

    this.dropAreaElement = document.getElementById('drop-area');
    this.flowButtonElement = document.getElementById('flow-button');

    const dropArea: HTMLElement[] = (<HTMLElement[]><any>this.dropAreaElement);
    const flowButton: HTMLElement[] = (<HTMLElement[]><any>this.flowButtonElement);

    if (this.dropAreaElement) {
      this.flow.assignDrop(dropArea);
      this.flow.assignBrowse(flowButton, false, false, {});
      this._assignFlowEvents();
    }
  }

  private _assignFlowEvents(): void {
    this.flow.on('fileAdded', (flowFile: Flow.IFlowFile) => {
      const reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        const hasErrors = this._handleErrors(readerEvent.target.result);
        if (hasErrors) {
          return;
        }
        this._handleImage(readerEvent);
      };
      reader.readAsDataURL(flowFile.file);
    });
  }

  private _handleErrors(base64: string): boolean {
    const hasError = isGif(base64);
    if (hasError) {
      this.onError.emit(new ErrorPicture('ImageType', 'Gif was not supported'));
      return hasError;
    }
  }

  private _handleImage(readerEvent: any) {
    let resultBase64: string = readerEvent.target.result;
    resultBase64 = resultBase64.substr(23, resultBase64.length);
    const image = new Image();
    image.src = readerEvent.target.result;
    image.onload = () => {
      this.image = new Base64Image(readerEvent.target.result, false);
      this.onImageChange.emit(this.image);
    };
    this.flow.files = [];
  }
}
