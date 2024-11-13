import { message } from "antd";
import { ErrorResponseValidation } from "../interfaces/error.interface";
import { ErrorResponse } from "../interfaces/response.interface";

export const handleError = (error: unknown) => {
    const e = error as ErrorResponse;
    if (e?.message) {
        message.error(e.message);
    } else {
        const e = error as ErrorResponseValidation;
        if ('errors' in e) {
            e.errors.forEach(error => {
                message.error(error.msg);
            });
        } else {
            console.log('Registration error:', error);
            message.error('Ocurrió un error');
        }
    }
}
