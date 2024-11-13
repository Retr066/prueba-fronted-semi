export interface Response <T = unknown> {
    message: string;
    status: number;
    statusText: string;
    data?: T;
}

export interface ErrorResponse {
    message: string;
    status: number;
    statusText: string;
}
