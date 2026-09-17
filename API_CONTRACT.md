# DirectMart API Contract

Base URL (local dev): `http://localhost:5000/api`

All authenticated routes require header: `Authorization: Bearer <token>`

## Auth

### POST /auth/signup
Request:
```json
{ "name": "Ravi", "email": "ravi@example.com", "password": "secret123", "role": "seller" }
```
Response `201`:
```json
{ "token": "jwt...", "user": { "id": "...", "name": "Ravi", "role": "seller" } }
```

### POST /auth/login
Request: `{ "email": "...", "password": "..." }`
Response `200`: same shape as signup

### GET /auth/me
Requires auth. Returns the logged-in user's profile (no password).

## Products

### GET /products?domain=farming&search=tomato&page=1
Public. Returns:
```json
{
  "products": [
    { "id": "...", "name": "Tomatoes", "price": 40, "stock": 100, "imageUrl": "...", "domain": "farming", "sellerId": "..." }
  ],
  "totalPages": 3
}
```

### GET /products/:id
Public. Returns one product with full details + seller name.

### POST /products
Requires auth (seller only). `multipart/form-data`: `name, price, stock, description, domain, image`.
Response `201`: the created product.

### PUT /products/:id
Requires auth (must be the owning seller). Same body shape as POST, all fields optional.

### DELETE /products/:id
Requires auth (must be the owning seller).

### GET /products/seller/mine
Requires auth (seller). Returns all products belonging to the logged-in seller.

## Cart (stored client-side for now — see note)

> For the mini-project version, cart can just live in frontend state / localStorage instead of
> the database, to keep scope manageable. Revisit only if you want persistent carts across
> devices.

## Orders

### POST /orders
Requires auth (buyer). Request:
```json
{
  "items": [{ "productId": "...", "quantity": 2 }],
  "totalAmount": 480,
  "paymentId": "razorpay_or_stripe_payment_id"
}
```
Response `201`: created order object with `status: "placed"`.

### GET /orders/mine
Requires auth (buyer). Returns the logged-in buyer's order history.

### GET /orders/seller
Requires auth (seller). Returns orders containing this seller's products.

### PUT /orders/:id/status
Requires auth (seller, must own the order's product). Request: `{ "status": "shipped" }`.
Valid statuses: `placed -> packed -> shipped -> delivered`.

---

**Rule for the team:** if a field name or endpoint needs to change, update this file first,
then message the group — don't change it silently in code, since the other side won't know.
