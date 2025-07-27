# 🍿 SnackShop – Full-Stack Próbafeladat (2025.07)

Ez egy teljes stack webalkalmazás, ahol felhasználók snackeket rendelhetnek, az admin pedig termékeket és rendeléseket kezelhet.  
A projekt a 2025. júliusi full-stack próbafeladat alapján készült.

## 🛠 Tech stack

### Frontend
- React
- TypeScript / JavaScript
- UI: Material UI 6
- Axios (REST API hívásokhoz)
- Állapotkezelés: React Context

### Backend
- Node.js
- Fastify
- MySQL (Indoklás alább)
- Prisma (ORM / adatbázis kliens)
- Bcrypt (jelszóhash)
- Session / Cookie alapú authentikáció
- Cors – CORS engedélyezés
- Dotenv – környezeti változókhoz

### Indoklás: Miért MySQL?
A projektben MySQL-t választottam az adatbáziskezeléshez, mivel ez a technológia már jól ismert számomra, így a fókuszt az üzleti logika megvalósítására és a REST API kialakítására tudtam helyezni. MySQL egy iparági szabvány, széles körben támogatott és skálázható, így hosszú távon is stabil választás.
A megvalósítás során az adatbázis absztrakciót úgy építem fel (Prisma segítségével), hogy később könnyen átállítható legyen más SQL-alapú adatbázisra is.

## ⚙️ Telepítés & Indítás

### 1. Adatbázis (MySQL preferált)

Győződj meg róla, hogy a MySQL (vagy egyéb) szerver fut, és elérhető a megfelelő felhasználónév/jelszó kombinációval.

Hozd létre az adatbázist *snackshopdb* néven:

```sql
CREATE DATABASE snackshopdb;
```

(Használhatsz más adatbázist is viszont akkor ügyelj a `backend/prisma/schema.prisma -fájl beállításaira!`)
### 2. Backend

Hozd létre a `.env` fájlt a `backend/` mappában az alábbi tartalommal (vagy más konfiguráció szerint):  

DATABASE_URL="mysql://root@localhost:3306/snackshopdb"  
PORT=PORTSZÁMOD (mondjuk 3002 vagy 3003, amit használni szeretnél backendhez)
NODE_ENV=development (ha éles környezetben akarod használni:) production  

Amennyiben nem MySQL-t használsz, akkor a DATABASE_URL-be a saját url-det illeszd be!  

#### Bash parancsok:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend

Módosítsd a `frontend/` mappában a `vite.config.js` fájlt aszerint a portszám szerint, amelyik portszámot használod a backend szerveren!

#### Bash parancsok:
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentikáció
- Regisztráció: új felhasználók (admin fiók fixen van)
- Belépés: munkamenet alapú (cookie + session)
- Admin védelem middleware-rel
- Jelszavak bcrypt-tel titkosítva

## 🔄 REST API végpontok
Auth
- POST /api/register – új felhasználó
- POST /api/login – bejelentkezés

Termékek
- GET /api/products – snackek listázása (mindenkinek)
- POST /api/products – új termék (admin)
- PUT /api/products/:id – módosítás (admin)
- DELETE /api/products/:id – törlés (admin)

Rendelés
- POST /api/order – rendelés leadása (felhasználó)
- GET /api/orders – összes rendelés lekérése (admin)


Köszönöm, hogy elolvastad! 🙌
