export const notFoundHandler = (request, response) => {
    response.status(404).json({
        data: null,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `No route exists for ${request.method} ${request.originalUrl}.`,
        },
    });
};
//# sourceMappingURL=not-found.js.map