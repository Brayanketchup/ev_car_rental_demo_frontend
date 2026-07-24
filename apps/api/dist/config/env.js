import 'dotenv/config';
import { z } from 'zod';
const environmentSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: z.coerce
        .number()
        .int()
        .positive()
        .max(65535)
        .default(4000),
    CORS_ORIGINS: z
        .string()
        .default('http://localhost:3000')
        .transform((value) => value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0)),
});
const parsedEnvironment = environmentSchema.safeParse(process.env);
if (!parsedEnvironment.success) {
    console.error('Invalid API environment variables:', parsedEnvironment.error.flatten().fieldErrors);
    throw new Error('The API environment configuration is invalid.');
}
export const env = parsedEnvironment.data;
//# sourceMappingURL=env.js.map