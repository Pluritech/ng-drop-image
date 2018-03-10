import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Flow from '@flowjs/flow.js';

var isGif = function (base64) { return base64.includes('image/gif'); };
var isSmallerThan = function (image, width, heigth) { return image.width < width || image.height < heigth; };

var Base64Image = (function () {
    /**
     * @param {?} base64Full
     * @param {?=} main
     */
    function Base64Image(base64Full, main) {
        if (main === void 0) { main = false; }
        this.base64Full = base64Full;
        this.base64Min = base64Full.split(',')[1];
        this.main = main;
    }
    return Base64Image;
}());
var ErrorPicture = (function () {
    /**
     * @param {?} status
     * @param {?} message
     */
    function ErrorPicture(status, message) {
        this.status = status;
        this.message = message;
    }
    return ErrorPicture;
}());

var DropImageComponent = (function () {
    function DropImageComponent() {
        /**
         * An boolean to indicate if you want to work with a single image or multiple. Default is true
         */
        this.singleImage = true;
        /**
         * An function to call when has an error with the image
         */
        this.onError = new EventEmitter();
        /**
         * An function to call when the image have changed, only if you're using an single image
         */
        this.onImageChange = new EventEmitter();
        /**
         * An function to call when an local image is seted as main
         */
        this.onLocalImageSetAsMain = new EventEmitter();
        /**
         * An function to call when an local image is deleted
         */
        this.onLocalImageDelete = new EventEmitter();
        /**
         * An function to call every time the list is updated, it emits the entire list
         */
        this.onUpdateList = new EventEmitter();
        /**
         * An function to call when an server image is seted as main
         */
        this.onServerImageSetAsMain = new EventEmitter();
        /**
         * An function to call when an server image is deleted
         */
        this.onServerImageDelete = new EventEmitter();
        this.localList = [];
        this.serverList = [];
    }
    /**
     * @return {?}
     */
    DropImageComponent.prototype.ngOnInit = function () {
        this._initFlow();
    };
    /**
     * @return {?}
     */
    DropImageComponent.prototype._initFlow = function () {
        this.flow = new Flow({
            accept: 'image/*'
        });
        this.dropAreaElement = document.getElementById('drop-area');
        this.flowButtonElement = document.getElementById('flow-button');
        var /** @type {?} */ dropArea = (((this.dropAreaElement)));
        var /** @type {?} */ flowButton = (((this.flowButtonElement)));
        if (this.dropAreaElement) {
            this.flow.assignDrop(dropArea);
            this.flow.assignBrowse(flowButton, false, false, {});
            this._assignFlowEvents();
        }
    };
    /**
     * @return {?}
     */
    DropImageComponent.prototype._assignFlowEvents = function () {
        var _this = this;
        this.flow.on('fileAdded', function (flowFile) {
            var /** @type {?} */ reader = new FileReader();
            reader.onload = function (readerEvent) {
                var /** @type {?} */ hasErrors = _this._handleErrorType(readerEvent.target.result);
                if (hasErrors) {
                    return;
                }
                _this._handleImage(readerEvent);
            };
            reader.readAsDataURL(flowFile.file);
        });
    };
    /**
     * @param {?} base64
     * @return {?}
     */
    DropImageComponent.prototype._handleErrorType = function (base64) {
        var /** @type {?} */ hasError = isGif(base64);
        if (hasError) {
            this.onError.emit(new ErrorPicture('ImageType', 'Gif was not supported'));
        }
        return hasError;
    };
    /**
     * @param {?} readerEvent
     * @return {?}
     */
    DropImageComponent.prototype._handleImage = function (readerEvent) {
        var _this = this;
        var /** @type {?} */ image = new Image();
        image.src = readerEvent.target.result;
        image.onload = function () {
            var /** @type {?} */ errorSize = _this._handleImageSize(image.width, image.height);
            if (errorSize) {
                return;
            }
            _this.image = new Base64Image(readerEvent.target.result, false);
            if (_this.singleImage) {
                _this.onImageChange.emit(_this.image);
            }
            else {
                _this.localList.push(_this.image);
                _this.onUpdateList.emit(_this.localList);
            }
        };
        this.flow.files = [];
    };
    /**
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    DropImageComponent.prototype._handleImageSize = function (width, height) {
        if (!this.minWidth && !this.minHeigth) {
            return;
        }
        var /** @type {?} */ hasError = isSmallerThan({ width: width, height: height }, this.minWidth, this.minHeigth);
        if (hasError) {
            this.onError.emit(new ErrorPicture('ImageSize', 'The image is smaller than defined'));
        }
        return hasError;
    };
    return DropImageComponent;
}());
DropImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'pluri-drop-image',
                template: "<div class=\"input-group\"> <input type=\"text\" class=\"form-control\" disabled [placeholder]=\"inputPlaceholder\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-info btn-flat btn-social\" id=\"flow-button\"> <i class=\"fa fa-picture-o\"></i> {{btnSelect}} </button> </span> </div> <div class=\"image-preview\" id=\"drop-area\"> <div *ngIf=\"singleImage\" class=\"single-image\" > <img [src]=\"image?.base64Full || imagePath\" *ngIf=\"image || imagePath\"> <p *ngIf=\"hasError\" class=\"text-danger\"> {{errorText}} </p> <p *ngIf=\"!hasError && (!image && !imagePath)\"> {{defaultText}} </p> </div> <div class=\"container-images\"> <div *ngIf=\"!singleImage\" class=\"multiple\"> <div class=\"col-xs-12 col-sm-6 col-md-4 col-lg-3 container-item\" *ngFor=\"let img of localList\"> <img [src]=\"img.base64Full\" class=\"img-responsive\" [ngClass]=\"{'is-main': img.main}\" (click)=\"onLocalImageSetAsMain.emit(img);\"> <i class=\"glyphicon glyphicon-remove-circle remove-image-button\" (click)=\"onLocalImageDelete.emit(img);\"></i> <i class=\"glyphicon glyphicon-ok-circle select-cover-image-button\" *ngIf=\"img.main\"></i> </div> <div class=\"col-xs-12 col-sm-6 col-md-4 col-lg-3 container-item\" *ngFor=\"let img of serverList\"> <img [src]=\"img.path\" class=\"img-responsive\" [ngClass]=\"{'is-main': img.main}\" (click)=\"onServerImageSetAsMain.emit(img);\"> <i class=\"glyphicon glyphicon-remove-circle remove-image-button\" (click)=\"onServerImageDelete.emit(img);\"></i> <i class=\"glyphicon glyphicon-ok-circle select-cover-image-button\" *ngIf=\"img.main\"></i> </div> </div> </div> </div> ",
                styles: ["\n    .image-preview {\n      border: 1px dashed #333;\n      border-top: none;\n      padding: 30px;\n      padding-bottom: 60px;\n      margin-bottom: 20px;\n    }\n    .image-preview .single-image {\n      text-align: center;\n    }\n    \n    .image-preview .single-image > img {\n      max-width: 200px;\n      max-height: 200px;\n    }\n    \n    .image-preview .container-images .multiple{\n      display: flex;\n      flex-direction: row;\n      flex-wrap: wrap;\n      justify-content: flex-start;\n    }\n    .image-preview .container-images .container-item {\n      display: flex;\n      position: relative;\n      padding: 0 15px 15px 15px;\n    }\n    .image-preview .container-images .container-item > img {\n      width: 100%;\n      max-height: 200px;\n      margin-bottom: 10px;\n    }\n    .image-preview .container-images .container-item > img:not(.is-cover) {\n      cursor: pointer;\n      transition: all linear .2s;\n    }\n    .image-preview .container-images .container-item > img:not(.is-cover):hover {\n      border: 1px solid #00cc00;\n    }\n    .image-preview .container-images .container-item > .remove-image-button {\n      position: absolute;\n      right: 9px;\n      top: -7px;\n      font-size: 2em;\n      color: #ff6666;\n      cursor: pointer;\n      transition: all linear .2s;\n    }\n    .image-preview .container-images .container-item > .remove-image-button:hover {\n      color: red;\n      font-size: 2.2em;\n    }\n    .image-preview .container-images .container-item > .select-cover-image-button {\n      position: absolute;\n      left: 11px;\n      top: -7px;\n      font-size: 2em;\n      color: #00cc00;\n    }\n    .image-preview .container-images .container-item > .edit-image-button {\n      position: absolute;\n      bottom: 5px;\n      left: 7px;\n      font-size: 2em;\n      color: #f19a2f;\n      cursor: pointer;\n      transition: all linear .2s;\n    }\n    .image-preview .container-images .container-item > .edit-image-button:hover {\n      color: #de810f;\n      font-size: 2.2em;\n    }\n  "]
            },] },
];
/**
 * @nocollapse
 */
DropImageComponent.ctorParameters = function () { return []; };
DropImageComponent.propDecorators = {
    'btnSelect': [{ type: Input },],
    'hasError': [{ type: Input },],
    'errorText': [{ type: Input },],
    'defaultText': [{ type: Input },],
    'inputPlaceholder': [{ type: Input },],
    'singleImage': [{ type: Input },],
    'imagePath': [{ type: Input },],
    'minWidth': [{ type: Input },],
    'minHeigth': [{ type: Input },],
    'onError': [{ type: Output },],
    'onImageChange': [{ type: Output },],
    'localList': [{ type: Input },],
    'onLocalImageSetAsMain': [{ type: Output },],
    'onLocalImageDelete': [{ type: Output },],
    'onUpdateList': [{ type: Output },],
    'serverList': [{ type: Input },],
    'onServerImageSetAsMain': [{ type: Output },],
    'onServerImageDelete': [{ type: Output },],
};

var DropImageModule = (function () {
    function DropImageModule() {
    }
    return DropImageModule;
}());
DropImageModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [DropImageComponent],
                exports: [DropImageComponent]
            },] },
];
/**
 * @nocollapse
 */
DropImageModule.ctorParameters = function () { return []; };

export { DropImageModule, Base64Image, ErrorPicture, DropImageComponent, isGif, isSmallerThan };
