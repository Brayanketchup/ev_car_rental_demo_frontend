export const errorHandler = (error, _request, response, _next) => {
    const message = error instanceof Error
        ? error.message
        : 'An unknown server error occurred.';
    console.error('Unhandled API error:', message);
    response.status(500).json({
        data: null,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'The server could not complete the request.',
        },
    });
};
//# sourceMappingURL=error-handler.js.map