import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { routes } from './routes/routes.js';
import { createAdminIfNotExists } from './createAdmin.js';

dotenv.config();
await createAdminIfNotExists();

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 3002;  //.env portszám: 3001


await fastify.register(cors, {
    origin: true,
    credentials: true,
});

fastify.register(cookie);

fastify.get('/', async () => {
    return { message: 'SnackShop API működik!' };
});

await routes(fastify);

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        console.log(`A webszerver elindult a következő URL-en: http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();