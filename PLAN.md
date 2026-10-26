# MealMate shared menu and orders plan

## Problem and approach

Replace the static demo state with a Cloudflare Worker API backed by a KV namespace. The Worker will serve the built Vite assets and expose JSON endpoints for the current menu and orders. React will load and mutate that shared state, while the staff name remains device-local in `localStorage`.

The implementation will keep the existing two-screen flow and explicitly avoid accounts, passwords, payments, and cutoff-time behavior.

## Numbered implementation steps

1. **Define the shared data contract and Worker API**
   - Create `src/worker.ts`.
   - Add typed menu/order models and request validation.
   - Implement `GET /api/state`, menu publish/add/remove operations, order creation, and order cancellation.
   - Store the current menu and orders in Cloudflare KV and return explicit JSON errors for invalid requests.
   - Add CORS behavior appropriate for the deployed app and a Worker fallback to the static assets.

2. **Configure Cloudflare KV and local/deployment routing**
   - Change `wrangler.jsonc` to declare the Worker entry, KV namespace binding, and assets behavior.
   - Create or update `vite.config.ts` only as needed for local `/api` development.
   - Add any required Worker type package/configuration in `package.json` and TypeScript configuration without weakening existing checks.

3. **Add a typed frontend API/state layer**
   - Create `src/api.ts` (or the smallest equivalent shared module).
   - Centralize fetch calls, response parsing, and user-facing error propagation.
   - Define refresh/update behavior so Admin and Staff see the same menu/orders after reload and after mutations, they should see the most updated information.

4. **Persist the staff name on the device**
   - Update `src/App.tsx` and `src/NameGate.tsx`.
   - Read the saved name from `localStorage` on startup, show the gate only when absent, save a non-empty submitted name.
   - After staff input his/her name once under "Your name" and he/she pressed the "continue" butotn, the name input is saved in local device.
   - Keep the name out of the server until an order is submitted.

5. **Implement shared staff ordering and cancellation**
   - Update `src/StaffScreen.tsx` and `src/StaffScreen.css`.
   - Load the Worker state, render the published menu, let the named staff member place one order for a dish, show the staff member and current order status, and allow cancellation.
   - Remove the static cutoff/demo spend behavior because no cutoff times or payments are requested.

6. **Implement Admin publishing, counts, and order details**
   - Update `src/AdminScreen.tsx` and `src/AdminScreen.css`.
   - Load the shared state, add/remove dishes through the Worker API, show each dish’s current non-cancelled order total, show total orders, and add an order-details section identifying who ordered what and the dish the stadd ordered, while only included those non-cancelled one.
   - Preserve the existing Staff/Admin navigation.

7. **Document setup and verification**
   - Update `README.md` with KV namespace creation/binding, local development, deployment, and API behavior.
   - Add focused tests if the repository’s test setup is introduced; otherwise use the existing build/lint plus a manual two-browser/device acceptance checklist.

## How to test the result

1. Run the existing type-check/build and lint commands.
2. Run the Worker locally with a KV preview namespace and open the Vite/Worker app.
3. In one browser, enter a staff name, reload, and confirm the name is remembered.
4. In the Admin view, add two dishes, reload, and confirm they remain; remove one and confirm it disappears.
5. In a separate browser/device, confirm the the most updated menu appears, place an order, reload, and confirm the order remains associated with the entered name.
6. Cancel the order and confirm it is no longer counted for the dish.
7. Place orders from two different names/devices, reload both clients, and confirm Admin totals and “who ordered what” match the shared KV state.
8. Deploy with Wrangler and repeat the cross-browser checks against the deployed URL.

## Confirmed Requirements

- There is one current shared menu.
- Staff can place at most one active order at a time; cancelling removes it from counts and allows that staff member to order again.
- The Admin tab remains intentionally unauthenticated because accounts/passwords are out of scope.
- “Publish” means adding/removing dishes in the current menu, not replacing the entire menu in one transaction.

## Not in this plan 
- There is no "Not You?" function to clear the saved name in the NameGate.tsx
- The Admin order-details section doesn't retain the cancelled record

