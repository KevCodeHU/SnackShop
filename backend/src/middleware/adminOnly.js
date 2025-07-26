import prisma from '../../prisma/client.js';

export const adminOnly = async (request, reply) => {
    const userId = request.cookies.userId;

    if (!userId) {
        return reply.code(401).send({ error: 'Bejelentkezés szükséges' });
    }

    try {
        const user = await prisma.felhasznalo.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user || !user.adminE) {
            return reply.code(403).send({ error: 'Nincs jogosultság' });
        }

    } catch (err) {
        reply.code(500).send({ error: 'Hiba az admin jogosultság ellenőrzésekor', message: err.message });
    }
};
