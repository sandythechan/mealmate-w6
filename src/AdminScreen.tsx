import { useEffect, useState, type FormEvent } from 'react'
import { addMenuItem, getState, removeMenuItem, type AppState } from './api'
import './AdminScreen.css'

type AdminScreenProps = {
  onStaffSelect: () => void
}

function AdminScreen({ onStaffSelect }: AdminScreenProps) {
  const [state, setState] = useState<AppState>({ menu: [], orders: [] })
  const [message, setMessage] = useState('Loading menu...')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    getState().then(setState).catch((error: Error) => setMessage(error.message))
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setState(await addMenuItem(name, Number(price)))
      setName('')
      setPrice('')
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The request failed.')
    }
  }

  const activeOrders = state.orders.filter((order) => order.status === 'active')

  return (
    <main className="admin-screen">
      <header className="admin-header">
        <strong>MealMate</strong>
        <span>FRI, AUG 14</span>
      </header>

      <nav className="admin-tabs" aria-label="Main navigation">
        <a
          className="admin-tab"
          href="#staff"
          onClick={(event) => {
            event.preventDefault()
            onStaffSelect()
          }}
        >
          Staff
        </a>
        <a className="admin-tab admin-tab-active" href="#admin">
          Admin
        </a>
      </nav>

      <section className="publish-section" aria-labelledby="publish-title">
        <h1 id="publish-title">PUBLISH TODAY&apos;S MENU</h1>
        <form className="publish-form" onSubmit={handleSubmit}>
          <label htmlFor="dish-name">Dish name</label>
          <input
            id="dish-name"
            name="dish-name"
            type="text"
            placeholder="e.g. Grilled Chicken Wrap"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <label htmlFor="dish-price">Price ($)</label>
          <input
            id="dish-price"
            name="dish-price"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />

          <button type="submit">
            Add to Menu
          </button>
        </form>
      </section>

      <section className="admin-menu" aria-labelledby="admin-menu-title">
        <h2 id="admin-menu-title">MENU · {state.menu.length} DISHES</h2>
        <div className="admin-menu-list">
          {state.menu.map((item) => (
            <div className="admin-menu-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>${item.price.toFixed(2)}</span>
              </div>
              <div className="ordered-count">
                <strong>{activeOrders.filter((order) => order.dishId === item.id).length}</strong>
                <span>ordered</span>
              </div>
              <button
                className="remove-dish"
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() => {
                  removeMenuItem(item.id)
                    .then(setState)
                    .catch((error: Error) => setMessage(error.message))
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {message && <p className="orders-today">{message}</p>}
      <p className="orders-today">
        {activeOrders.length} order{activeOrders.length === 1 ? '' : 's'} today
      </p>
      <section className="order-details" aria-labelledby="order-details-title">
        <h2 id="order-details-title">ORDER DETAILS</h2>
        {activeOrders.map((order) => (
          <p key={order.id}>{order.staffName} ordered {order.dishName}</p>
        ))}
      </section>
    </main>
  )
}

export default AdminScreen
