# DirectMart — Starter Code

This is the skeleton project matching the plan your team laid out: 4 domains (farming, fishing,
pottery, dairy), role-based auth (buyer/seller), product CRUD, cart, checkout, and order tracking.

## Folder structure

```
directmart/
  server/     -> Express + MongoDB backend
  client/     -> React frontend
  API_CONTRACT.md -> the endpoint list everyone should build against
```

## One-time setup (everyone on the team)

1. `git clone` the repo once it's pushed to GitHub.
2. Backend:
   ```
   cd server
   npm install
   cp .env.example .env
   ```
   Then fill in `.env` with the MongoDB connection string, Cloudinary keys, and Razorpay/Stripe
   test keys your team already generated.
3. Frontend:
   ```
   cd client
   npm install
   ```
4. Run both (in two separate terminals):
   ```
   cd server && npm run dev
   cd client && npm start
   ```
   Backend runs on http://localhost:5000, frontend on http://localhost:3000.

## What's already built (skeleton, not final)

- **Auth**: signup/login with role (buyer/seller), JWT, password hashing
- **Products**: CRUD + domain filter (`?domain=farming`), image upload wired to Cloudinary
- **Orders**: create order, seller updates status, buyer views history
- **Frontend**: Home (domain cards) → DomainPage (product grid) → ProductDetail → Cart → Checkout,
  plus a basic Seller Dashboard and Add Product form

Everything here is intentionally minimal — no styling polish, no payment capture logic wired to a
real gateway response yet, no admin approval flow. That's exactly what's left for your team to
build out on top of this, split by the roles you already assigned.

## Next steps for your team
- Member A: flesh out `/server/routes/auth.js` — password reset, profile edit, seller approval
- Member B: finish `/server/routes/orders.js` payment capture + `/server/routes/products.js` search/pagination
- Member C: style `client/src/pages/Home.jsx`, `DomainPage.jsx`, `ProductDetail.jsx`, `Cart.jsx`, `Checkout.jsx`
- Member D: style `client/src/pages/SellerDashboard.jsx`, `AddProduct.jsx`, `SellerOrders.jsx`, wire up routing/auth guards
