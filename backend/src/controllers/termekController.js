import prisma from '../../prisma/client.js';

export const listazTermek = async (request, reply) => {
  const termekek = await prisma.termek.findMany({
    where: { torolt: false },
  });
  reply.send(termekek);
};

export const letrehozTermek = async (request, reply) => {
  const { nev, ar, keszlet } = request.body;

  if (!nev || ar == null || keszlet == null) {
    return reply.code(400).send({ error: 'Hiányzó adatok', message: 'A név, ár és készlet megadása kötelező.' });
  }

  try {
    const letezoTermek = await prisma.termek.findFirst({
      where: {
        nev: nev
      }
    });

    if (!letezoTermek) {
      const ujTermek = await prisma.termek.create({
        data: { nev, ar: parseFloat(ar), keszlet: parseInt(keszlet) },
      });

      reply.code(201).send(ujTermek);
    } else if (letezoTermek.torolt) {
      const visszahozott = await prisma.termek.update({
        where: { id: letezoTermek.id },
        data: {
          torolt: false,
          ar: parseFloat(ar),
          keszlet: parseInt(keszlet)
        }
      });
      reply.code(200).send(visszahozott);
    } else {
      return reply.code(409).send({ error: 'Hiba a termék létrehozásakor', message: 'A megadott terméknév már létezik!' })
    }
  } catch (err) {
    reply.code(500).send({ error: 'Szerverhiba', message: err.message });
  }
};

export const modositTermek = async (request, reply) => {
  const { id } = request.params;
  const { nev, ar, keszlet } = request.body;

  if (!nev || ar == null || keszlet == null) {
    return reply.code(400).send({ error: 'Hiányzó adatok', message: 'A név, ár és készlet megadása kötelező.' });
  }

  try {
    const modositott = await prisma.termek.update({
      where: { id: parseInt(id) },
      data: { nev, ar: parseFloat(ar), keszlet: parseInt(keszlet) },
    });
    reply.send(modositott);
  } catch (err) {
    reply.code(500).send({ error: 'Hiba a termék módosításakor', message: err.message });
  }
};

export const torolTermek = async (request, reply) => {
  const { id } = request.params;

  try {
    await prisma.termek.update({
      where: { id: parseInt(id) },
      data: { torolt: true },
    });
    reply.send({ message: 'Termék törölve (soft delete)' });
  } catch (err) {
    reply.code(500).send({ error: 'Hiba a termék törlésekor', message: err.message });
  }
};
