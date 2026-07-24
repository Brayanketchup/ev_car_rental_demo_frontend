import type {
    NextFunction,
    Request,
    Response,
} from 'express';

export const errorHandler = (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction
): void => {
    const message =
        error instanceof Error
            ? error.message
            : 'An unknown server error occurred.';

    console.error('Unhandled API error:', message);

    response.status(500).json({
        data: null,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message:
                'The server could not complete the request.',
        },
    });
};