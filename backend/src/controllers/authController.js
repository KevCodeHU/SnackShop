import prisma from '../../prisma/client.js';
import bcrypt from 'bcryptjs';

export const register = async (request, reply) => {
  const { felhasznaloNev, email, jelszo } = request.body;

  if (!felhasznaloNev || !email || !jelszo) {
    return reply.code(400).send({ error: 'Hiányzó adatok', message: 'A felhasználónév, email és jelszó megadása kötelező.' });
  }

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
    if (err.code === 'P2002') {
      return reply.code(409).send({
        error: 'Duplikált adat',
        message: 'Ez a felhasználónév vagy email már használatban van.'
      })
    }
    reply.code(400).send({ error: 'Regisztrációs hiba', message: err.message });
  }
};

export const login = async (request, reply) => {
  const { azonosito, jelszo } = request.body;

  if (!azonosito || !jelszo) {
    return reply.code(400).send({ error: 'Hiányzó adatok', message: 'A felhasználónév/email és jelszó megadása kötelező.' });
  }

  try {
    const user = await prisma.felhasznalo.findFirst({
      where: {
        OR: [
          { felhasznaloNev: azonosito },
          { email: azonosito }
        ]
      },
    });

    const jelszoEgyezik = user && await bcrypt.compare(jelszo, user.jelszo);
    if (!user || !jelszoEgyezik) {
      return reply.code(401).send({ authenticated: false, error: 'Hibás bejelentkezés', message: 'Érvénytelen felhasználónév/email vagy jelszó.' });
    }

    reply.setCookie('userId', user.id, { path: '/', httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', });
    reply.send({ authenticated: true, message: 'Sikeres bejelentkezés', userId: user.id, isAdmin: user.adminE });
  } catch (err) {
    reply.code(500).send({ authenticated: false, error: 'Bejelentkezési hiba', message: err.message });
  }
};

export const logout = async (request, reply) => {
  reply.clearCookie('userId', { path: '/' });
  reply.send({ message: 'Sikeres kijelentkezés' });
};