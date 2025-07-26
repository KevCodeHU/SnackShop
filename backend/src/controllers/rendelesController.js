import prisma from '../../prisma/client.js';

export const leadRendeles = async (request, reply) => {
  const userId = parseInt(request.cookies.userId);
  const { items } = request.body;

  if (!userId) {
    return reply.code(401).send({ error: 'Nem vagy bejelentkezve' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return reply.code(400).send({ error: 'Nincs megadva tétel a rendeléshez' });
  }

  try {
    for (const item of items) {
      const termek = await prisma.termek.findUnique({ where: { id: item.termekId } });

      if (!termek) {
        return reply.code(404).send({
          error: 'Nem található termék',
          message: `A(z) ${item.termekId} ID-jű termék nem létezik.`
        });
      }

      if (termek.keszlet == 0) {
        return reply.code(409).send({
          error: 'A termék elfogyott',
          message: `Sajnáljuk a(z) "${termek.nev}" jelenleg kifogyott a készletből.`
        });
      }

      if (item.mennyiseg > termek.keszlet && termek.keszlet != 0) {
        return reply.code(409).send({
          error: 'Nincs elég készlet',
          message: `A(z) "${termek.nev}" termékből csak ${termek.keszlet} db elérhető.`
        });
      }
    }

    const total = items.reduce((sum, item) => sum + item.ar * item.mennyiseg, 0);

    const rendeles = await prisma.$transaction(async (tx) => {
      const ujRendeles = await tx.rendeles.create({
        data: {
          felhasznaloId: userId,
          osszeg: total,
          tetelek: {
            create: items.map((item) => ({
              termekId: item.termekId,
              mennyiseg: item.mennyiseg,
              ar: item.ar,
            })),
          },
        },
        include: {
          tetelek: true,
        },
      });

      for (const item of items) {
        await tx.termek.update({
          where: { id: item.termekId },
          data: {
            keszlet: { decrement: item.mennyiseg },
          },
        });
      }

      return ujRendeles;
    });

    reply.code(201).send({ message: 'Rendelés sikeresen leadva', rendeles });
  } catch (err) {
    reply.code(500).send({ error: 'Rendelés sikertelen', message: err.message });
  }
};

export const osszesRendeles = async (request, reply) => {
  const userId = parseInt(request.cookies.userId);

  if (!userId) {
    return reply.code(401).send({ error: 'Nem vagy bejelentkezve' });
  }

  const user = await prisma.felhasznalo.findUnique({ where: { id: userId } });

  try {
    const rendelesek = await prisma.rendeles.findMany({
      orderBy: { letrehozva: 'desc' },
      include: {
        felhasznalo: {
          select: { felhasznaloNev: true, email: true }
        },
        tetelek: {
          include: {
            termek: true
          }
        }
      }
    });

    reply.send(rendelesek);
  } catch (err) {
    reply.code(500).send({ error: 'Nem sikerült lekérni a rendeléseket', message: err.message });
  }
};
