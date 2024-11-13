export interface ErrorValidation {
    location: string;
    msg: string;
    path: string;
    type: string;
}

export interface ErrorResponseValidation {
    errors: ErrorValidation[];
}
