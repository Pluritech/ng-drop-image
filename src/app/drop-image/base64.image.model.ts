export class Base64Image {
  base64Min: string;
  base64Full: string;
  main: boolean;
  error: ErrorPicture;

  constructor(base64Full: string, main = false) {
    this.base64Full = base64Full;
    this.base64Min = base64Full.replace('data:image/png;base64,', '');
    this.main = main;
  }
}

export class ErrorPicture {
  status: string;
  message: string;

  constructor (status: string, message: string) {
    this.status = status;
    this.message = message;
  }
}
