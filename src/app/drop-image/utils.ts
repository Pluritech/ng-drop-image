export const isGif = base64 => base64.includes('image/gif');
export const isSmallerThan = (image, width, heigth) => image.width < width || image.height < heigth
