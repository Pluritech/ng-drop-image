export declare class Base64Image {
    base64Min: string;
    base64Full: string;
    main: boolean;
    error: ErrorPicture;
    constructor(base64Full: string, main?: boolean);
}
export declare class ErrorPicture {
    status: string;
    message: string;
    constructor(status: string, message: string);
}
