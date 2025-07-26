import prisma from '../prisma/client.js';
import bcrypt from 'bcryptjs';

export async function createAdminIfNotExists() {
    const adminNev = 'admin';
    const adminEmail = 'admin@snackshop';
    const adminJelszo = 'SnackBoss2025';

    const existing = await prisma.felhasznalo.findFirst({
        where: {
            OR: [
                { felhasznaloNev: adminNev },
                { email: adminEmail }
            ]
        }
    });

    if (!existing) {
        const hashed = await bcrypt.hash(adminJelszo, 10);
        await prisma.felhasznalo.create({
            data: {
                felhasznaloNev: adminNev,
                email: adminEmail,
                jelszo: hashed,
                adminE: true,
            },
        });
        console.log('Admin felhasználó létrehozva');
    }
}

createAdminIfNotExists().catch((err) => {
    console.error('Hiba az admin felhasználó létrehozásakor:', err);
});
