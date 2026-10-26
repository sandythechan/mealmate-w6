type MenuItem = {
  id: string
  name: string
  price: number
}

type Order = {
  id: string
  staffName: string
  dishId: string
  dishName: string
  status: 'active' | 'cancelled'
}

type AppState = {
  menu: MenuItem[]
  orders: Order[]
}

type Env = {
  ORDERS: KVNamespace
  ASSETS: Fetcher
}

const STATE_KEY = 'state'
const emptyState: AppState = { menu: [], orders: [] }

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    },
  })
}

function error(message: string, status: number): Response {
  return json({ error: message }, status)
}

async function readState(env: Env): Promise<AppState> {
  return (await env.ORDERS.get<AppState>(STATE_KEY, 'json')) ?? emptyState
}

async function writeState(env: Env, state: AppState): Promise<Response> {
  await env.ORDERS.put(STATE_KEY, JSON.stringify(state))
  return json(state)
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json()
    return typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

function validName(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 100
}

function validPrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

const worker: ExportedHandler<Env> = {
  async fetch(request, env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return json(null, 204)
    }

    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request)
    }

    const state = await readState(env)

    if (url.pathname === '/api/state' && request.method === 'GET') {
      return json(state)
    }

    if (url.pathname === '/api/menu' && request.method === 'POST') {
      const body = await readJson(request)
      if (!body || !validName(body.name) || !validPrice(body.price)) {
        return error('A non-empty dish name and non-negative price are required.', 400)
      }

      const item: MenuItem = {
        id: crypto.randomUUID(),
        name: body.name.trim(),
        price: Math.round(body.price * 100) / 100,
      }
      return writeState(env, { ...state, menu: [...state.menu, item] })
    }

    const menuMatch = url.pathname.match(/^\/api\/menu\/([^/]+)$/)
    if (menuMatch && request.method === 'DELETE') {
      const menuId = decodeURIComponent(menuMatch[1])
      if (!state.menu.some((item) => item.id === menuId)) {
        return error('The dish was not found.', 404)
      }
      return writeState(env, {
        ...state,
        menu: state.menu.filter((item) => item.id !== menuId),
      })
    }

    if (url.pathname === '/api/orders' && request.method === 'POST') {
      const body = await readJson(request)
      const staffName = body?.staffName
      if (!body || !validName(staffName) || typeof body.dishId !== 'string') {
        return error('A staff name and dish are required.', 400)
      }
      if (state.orders.some((order) => order.staffName === staffName.trim() && order.status === 'active')) {
        return error('This staff member already has an active order.', 409)
      }
      const dish = state.menu.find((item) => item.id === body.dishId)
      if (!dish) {
        return error('The dish was not found.', 404)
      }

      const order: Order = {
        id: crypto.randomUUID(),
        staffName: staffName.trim(),
        dishId: dish.id,
        dishName: dish.name,
        status: 'active',
      }
      return writeState(env, { ...state, orders: [...state.orders, order] })
    }

    const orderMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/)
    if (orderMatch && request.method === 'DELETE') {
      const orderId = decodeURIComponent(orderMatch[1])
      const order = state.orders.find((item) => item.id === orderId)
      if (!order || order.status !== 'active') {
        return error('The active order was not found.', 404)
      }
      return writeState(env, {
        ...state,
        orders: state.orders.map((item) =>
          item.id === orderId ? { ...item, status: 'cancelled' } : item,
        ),
      })
    }

    return error('Endpoint not found.', 404)
  },
}

export default worker
