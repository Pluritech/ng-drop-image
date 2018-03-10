import { isGif, isSmallerThan } from './../utils/utils';
import { Base64Image, ErrorPicture } from './../models/base64.image.model';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as Flow from '@flowjs/flow.js'

@Component({
  selector: 'pluri-drop-image',
  templateUrl: './drop-image.component.html',
  styles: [`
    .image-preview {
      border: 1px dashed #333;
      border-top: none;
      padding: 30px;
      padding-bottom: 60px;
      margin-bottom: 20px;
    }
    .image-preview .single-image {
      text-align: center;
    }
    
    .image-preview .single-image > img {
      max-width: 200px;
      max-height: 200px;
    }
    
    .image-preview .container-images .multiple{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .image-preview .container-images .container-item {
      display: flex;
      position: relative;
      padding: 0 15px 15px 15px;
    }
    .image-preview .container-images .container-item > img {
      width: 100%;
      max-height: 200px;
      margin-bottom: 10px;
    }
    .image-preview .container-images .container-item > img:not(.is-cover) {
      cursor: pointer;
      transition: all linear .2s;
    }
    .image-preview .container-images .container-item > img:not(.is-cover):hover {
      border: 1px solid #00cc00;
    }
    .image-preview .container-images .container-item > .remove-image-button {
      position: absolute;
      right: 9px;
      top: -7px;
      font-size: 2em;
      color: #ff6666;
      cursor: pointer;
      transition: all linear .2s;
    }
    .image-preview .container-images .container-item > .remove-image-button:hover {
      color: red;
      font-size: 2.2em;
    }
    .image-preview .container-images .container-item > .select-cover-image-button {
      position: absolute;
      left: 11px;
      top: -7px;
      font-size: 2em;
      color: #00cc00;
    }
    .image-preview .container-images .container-item > .edit-image-button {
      position: absolute;
      bottom: 5px;
      left: 7px;
      font-size: 2em;
      color: #f19a2f;
      cursor: pointer;
      transition: all linear .2s;
    }
    .image-preview .container-images .container-item > .edit-image-button:hover {
      color: #de810f;
      font-size: 2.2em;
    }
  `]
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

  /** The text to be show in the blocked input*/
  @Input() inputPlaceholder: string;

  /** An boolean to indicate if you want to work with a single image or multiple. Default is true*/
  @Input() singleImage = true;

  /** The path of an image to show in the template, it can be a base64 or a image url, only if you're using an single image */
  @Input() imagePath: string;

  /** Min width in pixels of any image inserted, default is null, so, every image will be accepted. */
  @Input() minWidth: number;

  /** Min heigth of any image inserted, default is null, so, every image will be accepted */
  @Input() minHeigth: number;

  /** An function to call when has an error with the image */
  @Output() onError: EventEmitter<ErrorPicture> = new EventEmitter<ErrorPicture>();

  /** An function to call when the image have changed, only if you're using an single image */
  @Output() onImageChange: EventEmitter<Base64Image> = new EventEmitter<Base64Image>();

  /* Working with multiple images, the user can have two lists. In one list he can handle the images that was not send to server yet.
    The order list can handle images that was received from server, for example. */

  /** The local list of images need to be of type Base64Image*/
  @Input() localList: Base64Image[];
  /** An function to call when an local image is seted as main*/
  @Output() onLocalImageSetAsMain: EventEmitter<Base64Image> = new EventEmitter<Base64Image>();
  /** An function to call when an local image is deleted*/
  @Output() onLocalImageDelete: EventEmitter<Base64Image> = new EventEmitter<Base64Image>();
  /** An function to call every time the list is updated, it emits the entire list*/
  @Output() onUpdateList: EventEmitter<Base64Image[]> = new EventEmitter<Base64Image[]>();

  /** The server list of images, type any, but, it need to have the propertie path and the propertie main*/
  @Input() serverList: any[];
  /** An function to call when an server image is seted as main*/
  @Output() onServerImageSetAsMain: EventEmitter<any> = new EventEmitter<any>();
  /** An function to call when an server image is deleted*/
  @Output() onServerImageDelete: EventEmitter<any> = new EventEmitter<any>();

  private flow: Flow.IFlow;
  public image: any;
  private dropAreaElement: any;
  private flowButtonElement: any;
  constructor() {
    this.localList = [];
    this.serverList = [];
  }

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
        const hasErrors = this._handleErrorType(readerEvent.target.result);
        if (hasErrors) {
          return;
        }
        this._handleImage(readerEvent);
      };
      reader.readAsDataURL(flowFile.file);
    });
  }

  private _handleErrorType(base64: string): boolean {
    const hasError = isGif(base64);
    if (hasError) {
      this.onError.emit(new ErrorPicture('ImageType', 'Gif was not supported'));
    }
    return hasError;
  }

  private _handleImage(readerEvent: any): void {
    const image = new Image();
    image.src = readerEvent.target.result;
    image.onload = () => {
      const errorSize = this._handleImageSize(image.width, image.height);
      if (errorSize) {
        return;
      }

      this.image = new Base64Image(readerEvent.target.result, false);
      if (this.singleImage) {
        this.onImageChange.emit(this.image);
      } else {
        this.localList.push(this.image);
        this.onUpdateList.emit(this.localList);
      }
    };
    this.flow.files = [];
  }

  private _handleImageSize(width: number, height: number): boolean {
    if (!this.minWidth && !this.minHeigth) {
      return;
    }

    const hasError = isSmallerThan({width, height}, this.minWidth, this.minHeigth);
    if (hasError) {
      this.onError.emit(new ErrorPicture('ImageSize', 'The image is smaller than defined'));
    }

    return hasError;
  }

}
