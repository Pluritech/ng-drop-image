import { Base64Image, ErrorPicture } from './../models/base64.image.model';
import { OnInit, EventEmitter } from '@angular/core';
export declare class DropImageComponent implements OnInit {
    /** The text of 'select image' button */
    btnSelect: string;
    /** An boolean expression to show the error text */
    hasError: boolean;
    /** The error text */
    errorText: string;
    /** The default text, something like... 'Please, drop an image*/
    defaultText: string;
    /** The text to be show in the blocked input*/
    inputPlaceholder: string;
    /** An boolean to indicate if you want to work with a single image or multiple. Default is true*/
    singleImage: boolean;
    /** The path of an image to show in the template, it can be a base64 or a image url, only if you're using an single image */
    imagePath: string;
    /** Min width in pixels of any image inserted, default is null, so, every image will be accepted. */
    minWidth: number;
    /** Min heigth of any image inserted, default is null, so, every image will be accepted */
    minHeigth: number;
    /** An function to call when has an error with the image */
    onError: EventEmitter<ErrorPicture>;
    /** An function to call when the image have changed, only if you're using an single image */
    onImageChange: EventEmitter<Base64Image>;
    /** The local list of images need to be of type Base64Image*/
    localList: Base64Image[];
    /** An function to call when an local image is seted as main*/
    onLocalImageSetAsMain: EventEmitter<Base64Image>;
    /** An function to call when an local image is deleted*/
    onLocalImageDelete: EventEmitter<Base64Image>;
    /** An function to call every time the list is updated, it emits the entire list*/
    onUpdateList: EventEmitter<Base64Image[]>;
    /** The server list of images, type any, but, it need to have the propertie path and the propertie main*/
    serverList: any[];
    /** An function to call when an server image is seted as main*/
    onServerImageSetAsMain: EventEmitter<any>;
    /** An function to call when an server image is deleted*/
    onServerImageDelete: EventEmitter<any>;
    private flow;
    image: any;
    private dropAreaElement;
    private flowButtonElement;
    constructor();
    ngOnInit(): void;
    private _initFlow();
    private _assignFlowEvents();
    private _handleErrorType(base64);
    private _handleImage(readerEvent);
    private _handleImageSize(width, height);
}
