import { register, login, logout } from '../controllers/authController.js';
import {
listazTermek,
  letrehozTermek,
  modositTermek,
  torolTermek,
} from '../controllers/termekController.js';
import { leadRendeles, osszesRendeles } from '../controllers/rendelesController.js';
import { adminOnly } from '../middleware/adminOnly.js';

export async function routes(fastify) {
  // Auth
  fastify.post('/api/register', register);
  fastify.post('/api/login', login);
  fastify.post('/api/logout', logout);

  // Termékek
  fastify.get('/api/products', listazTermek);
  fastify.post('/api/products', { preHandler: adminOnly }, letrehozTermek);
  fastify.put('/api/products/:id', { preHandler: adminOnly }, modositTermek);
  fastify.delete('/api/products/:id', { preHandler: adminOnly }, torolTermek);

  // Rendelés
  fastify.post('/api/order', leadRendeles);
  fastify.get('/api/orders', { preHandler: adminOnly }, osszesRendeles);
}
