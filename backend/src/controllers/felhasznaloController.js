import { prisma } from '../../prisma/client.js';
import bcrypt from 'bcryptjs';

export const register = async (request, reply) => {
  const { felhasznaloNev, email, jelszo } = request.body;

  try {
    const hashed = await bcrypt.hash(jelszo, 10);
    const user = await prisma.felhasznalo.create({
      data: {
        felhasznaloNev,
        email,
        jelszo: hashed,
      },
    });
    reply.code(201).send({ message: 'Sikeres regisztráció', userId: user.id });
  } catch (err) {
    reply.code(400).send({ error: 'Regisztrációs hiba', details: err.message });
  }
};

export const login = async (request, reply) => {
  const { felhasznaloNev, jelszo } = request.body;

  try {
    const user = await prisma.felhasznalo.findUnique({
      where: { felhasznaloNev },
    });

    if (!user || !(await bcrypt.compare(jelszo, user.jelszo))) {
      return reply.code(401).send({ error: 'Hibás bejelentkezési adatok' });
    }

    reply.setCookie('userId', user.id, { path: '/', httpOnly: true });
    reply.send({ message: 'Sikeres bejelentkezés', userId: user.id, adminE: user.adminE });
  } catch (err) {
    reply.code(500).send({ error: 'Bejelentkezési hiba', details: err.message });
  }
};
