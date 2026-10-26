# MealMate

MealMate uses a React client and a Cloudflare Worker backed by KV for one shared
menu and shared active orders. The staff name is stored only in the browser's
`localStorage` until an order is submitted.

## Setup

Install dependencies and build the client:

```sh
npm install
npm run build
```

The KV namespace is bound as `ORDERS` in `wrangler.jsonc`. To create a new
namespace instead, run:

```sh
npx wrangler kv namespace create ORDERS
```

Replace the namespace `id` in `wrangler.jsonc` with the returned ID. For local
development, use a KV preview namespace:

```sh
npx wrangler kv namespace create ORDERS --preview
npx wrangler dev
```

In another terminal, run `npm run dev`. Vite proxies `/api` requests to the
local Worker on port 8787.

Deploy the built app and Worker with:

```sh
npm run build
npx wrangler deploy
```

## API

- `GET /api/state` returns the current menu and orders.
- `POST /api/menu` adds a dish from `{ "name": string, "price": number }`.
- `DELETE /api/menu/:id` removes a dish.
- `POST /api/orders` creates one active order from `{ "staffName": string, "dishId": string }`.
- `DELETE /api/orders/:id` cancels an active order.

Invalid requests return a JSON `{ "error": string }` response with an
appropriate 4xx status. Cancelled orders remain in KV history but are excluded
from counts and admin order details.
