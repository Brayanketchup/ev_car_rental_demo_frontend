import type {
    Request,
    Response,
} from 'express';

export const notFoundHandler = (
    request: Request,
    response: Response
): void => {
    response.status(404).json({
        data: null,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message:
                `No route exists for ${request.method} ${request.originalUrl}.`,
        },
    });
};