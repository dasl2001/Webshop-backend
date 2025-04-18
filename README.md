### README
Webshop 2025 – Backend API-dokumentation
Base URL:
https://webshop-2025-be-g10-five.vercel.app

Autentisering
POST /api/auth/register
Registrera en ny användare
{
  "name": "Anna",
  "email": "anna@example.com",
  "password": "password123"
}

POST /api/auth/login-user
Logga in som vanlig användare
{
  "email": "anna@example.com",
  "password": "password123"
}

POST /api/auth/login
Logga in som admin
{
  "email": "admin@example.com",
  "password": "adminpassword"
}


Produkter
GET /api/products
Hämta alla produkter
Exempel:
/api/products?search=chips&category=snacks&min=10&max=50&sort=price

GET /api/products/:id
Hämta en specifik produkt
Exempel:
/api/products/66123456789abc

POST /api/products (Admin)
Skapa ny produkt
Header: Authorization: Bearer <admin-token>
Body:
{
  "name": "Saltade chips",
  "price": 18,
  "description": "Lay's Classic saltade chips",
  "stock": 60,
  "category": "67e5295bb7a26193100f9ad7",
  "imageUrl": "https://example.com/image.jpg",
  "brand": "Lay's",
  "comparePrice": "360 kr/kg",
  "ingredients": "Potatis, solrosolja, salt",
  "nutrition": "Energi 524 kcal",
  "originCountry": "Nederländerna",
  "supplier": "PepsiCo Nordic AB"
}

PUT /api/products/:id (Admin)
Uppdatera en produkt

DELETE /api/products/:id (Admin)
Ta bort en produkt


Kategorier
GET /api/categories
Hämta alla kategorier
Exempel:
/api/categories?name=skafferi

POST /api/categories (Admin)
Skapa en ny kategori
{
  "name": "dryck"
}


Ordrar
GET /api/orders (Inloggad användare / Admin)
Vanlig användare får sina egna ordrar

Admin får alla ordrar
Header: Authorization: Bearer <token>

GET /api/orders/:id
Hämta en specifik order

POST /api/orders (Inloggad användare)
Skapa en ny order
Body:
{
  "products": [
    { "productId": "66123456789abc", "quantity": 2 }
  ],
  "totalPrice": 36
}


Användare
GET /api/users (Admin)
Hämta alla användare

GET /api/users/:id
Hämta information om en specifik användare


Övrig info
Statuskoder
200	OK
201	Created
400	Bad Request
401	Unauthorized (ej inloggad)
403	Forbidden (ingen behörighet)
404	Not Found
500	Serverfel


Miljövariabler
Skapa en .env-fil med följande:
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=din-hemliga-nyckel


Starta servern
npm install
npm run dev
