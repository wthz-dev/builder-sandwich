# Sandwich Backend API (Node.js + MySQL)

REST API for members, products, and orders.

## Prerequisites
- Node.js 18+
- MySQL 8+

## Setup
1. Create database and tables
   ```sql
   CREATE DATABASE IF NOT EXISTS sandwich_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE sandwich_shop;
   SOURCE schema.sql; -- or copy the content of schema.sql and run it
   ```

2. Configure environment
   ```bash
   cp .env.example .env
   # edit .env to match your MySQL credentials
   ```

3. Install dependencies
   ```bash
   npm install
   # or yarn
   ```

4. Run server
   ```bash
   npm run dev
   # server listens on http://localhost:4000
   ```

## API Overview

- GET /api/health

- Members
  - GET /api/members
  - GET /api/members/:id
  - POST /api/members { name, email, phone? }
  - PUT /api/members/:id { name?, email?, phone? }
  - DELETE /api/members/:id

- Products
  - GET /api/products
  - GET /api/products/:id
  - POST /api/products { id, name, description?, price, image?, badge? }
  - PUT /api/products/:id { id?, name?, description?, price?, image?, badge? }
  - DELETE /api/products/:id

- Orders
  - POST /api/orders { memberId?, items: [{ productId, qty }] }
  - GET /api/orders/:id  (accepts numeric id or public order_id)

Notes:
- Order totals are computed from product prices. A 10% discount is applied if memberId is present.
- All prices are stored as integers (minor units / THB satang not used; adjust if needed).

## Connecting Frontend
- Replace local cart checkout to call `POST /api/orders` with cart items and optional memberId.
- Load products from `GET /api/products` instead of hardcoding.
- Persist signed-in member (if any) to use as `memberId` when creating orders.
