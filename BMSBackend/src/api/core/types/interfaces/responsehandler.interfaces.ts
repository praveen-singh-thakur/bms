
export interface IResponseHandler {
    code: number;
    message: string;
    data?: unknown;
    error?: string;
}

