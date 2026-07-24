import { Router } from 'express';
export const healthRouter = Router();
healthRouter.get('/', (_request, response) => {
    response.status(200).json({
        data: {
            status: 'ok',
            service: 'ev-rental-api',
        },
        error: null,
    });
});
//# sourceMappingURL=health.routes.js.map