export type MenuItem = {
  id: string
  name: string
  price: number
}

export type Order = {
  id: string
  staffName: string
  dishId: string
  dishName: string
  status: 'active' | 'cancelled'
}

export type AppState = {
  menu: MenuItem[]
  orders: Order[]
}

type ApiError = {
  error?: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })
  const body: unknown = await response.json()

  if (!response.ok) {
    const apiError = typeof body === 'object' && body !== null
      ? (body as ApiError)
      : {}
    throw new Error(
      apiError.error ?? 'The request failed.',
    )
  }

  return body as T
}

export function getState(): Promise<AppState> {
  return request<AppState>('/api/state')
}

export function addMenuItem(name: string, price: number): Promise<AppState> {
  return request<AppState>('/api/menu', {
    method: 'POST',
    body: JSON.stringify({ name, price }),
  })
}

export function removeMenuItem(id: string): Promise<AppState> {
  return request<AppState>(`/api/menu/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

export function createOrder(
  staffName: string,
  dishId: string,
): Promise<AppState> {
  return request<AppState>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ staffName, dishId }),
  })
}

export function cancelOrder(id: string): Promise<AppState> {
  return request<AppState>(`/api/orders/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
