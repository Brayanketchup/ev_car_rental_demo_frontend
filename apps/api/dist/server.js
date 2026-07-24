import { app } from './app.js';
import { env } from './config/env.js';
const server = app.listen(env.PORT, () => {
    console.log(`EV Rental API listening on http://localhost:${env.PORT}`);
});
const shutdown = (signal) => {
    console.log(`${signal} received. Closing the API server.`);
    server.close((error) => {
        if (error) {
            console.error('Failed to close the API server:', error);
            process.exitCode = 1;
            return;
        }
        console.log('API server closed.');
        process.exitCode = 0;
    });
};
process.once('SIGINT', () => {
    shutdown('SIGINT');
});
process.once('SIGTERM', () => {
    shutdown('SIGTERM');
});
//# sourceMappingURL=server.js.map