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
    const rendelesTetelek = [];
    let total = 0;

    for (const item of items) {
      const termek = await prisma.termek.findUnique({ where: { id: item.termekId } });

      if (!termek) {
        return reply.code(404).send({
          error: 'Nem található termék',
          message: `A(z) ${item.termekId} ID-jű termék nem létezik.`
        });
      }

      if (termek.keszlet === 0) {
        return reply.code(409).send({
          error: 'A termék elfogyott',
          message: `Sajnáljuk, a(z) "${termek.nev}" jelenleg kifogyott a készletből.`
        });
      }

      if (item.mennyiseg > termek.keszlet) {
        return reply.code(409).send({
          error: 'Nincs elég készlet',
          message: `A(z) "${termek.nev}" termékből csak ${termek.keszlet} db elérhető.`
        });
      }

      const ossz = termek.ar * item.mennyiseg;
      total += ossz;

      rendelesTetelek.push({
        termekId: termek.id,
        mennyiseg: item.mennyiseg,
        ar: termek.ar,
        ossz
      });
    }

    const rendeles = await prisma.$transaction(async (tx) => {
      const ujRendeles = await tx.rendeles.create({
        data: {
          felhasznaloId: userId,
          osszeg: total,
          tetelek: {
            create: rendelesTetelek,
          },
        },
        include: {
          tetelek: {
            include: {

              termek: {
                select: {
                  nev: true,
                },
              },
            },
          },
          
          felhasznalo: {
            select: {
              felhasznaloNev: true,
            },
          },
        },
      });

      for (const tetel of rendelesTetelek) {
        await tx.termek.update({
          where: { id: tetel.termekId },
          data: {
            keszlet: { decrement: tetel.mennyiseg },
          },
        });
      }

      return ujRendeles;
    });

    const valasz = {
      message: 'Rendelés sikeresen leadva',
      rendeles: {
        osszeg: rendeles.osszeg,
        rendelonev: rendeles.felhasznalo.felhasznaloNev,
        tetelek: rendeles.tetelek.map(tetel => ({
          nev: tetel.termek.nev,
          mennyiseg: tetel.mennyiseg,
          mennyisegAr: tetel.ar,
          ossz: tetel.ossz
        }))
      }
    };

    reply.code(201).send(valasz);
    console.log('✅ Leadott rendelés:', JSON.stringify(valasz, null, 2));
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
