import { useEffect, useMemo, useState } from 'react'
import { cancelOrder, createOrder, getState, type AppState } from './api'
import './StaffScreen.css'

type StaffScreenProps = {
  name: string
  onAdminSelect: () => void
}

function StaffScreen({ name, onAdminSelect }: StaffScreenProps) {
  const [state, setState] = useState<AppState>({ menu: [], orders: [] })
  const [message, setMessage] = useState('Loading menu...')
  const activeOrder = useMemo(
    () => state.orders.find((order) => order.staffName === name && order.status === 'active'),
    [name, state.orders],
  )

  useEffect(() => {
    getState().then(setState).catch((error: Error) => setMessage(error.message))
  }, [])

  const update = async (action: () => Promise<AppState>) => {
    try {
      setState(await action())
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The request failed.')
    }
  }

  return (
    <main className="staff-screen">
      <header className="staff-header">
        <strong>MealMate</strong>
        <span>FRI, AUG 14</span>
      </header>

      <nav className="staff-tabs" aria-label="Main navigation">
        <a className="staff-tab staff-tab-active" href="#staff">
          Staff
        </a>
        <a
          className="staff-tab"
          href="#admin"
          onClick={(event) => {
            event.preventDefault()
            onAdminSelect()
          }}
        >
          Admin
        </a>
      </nav>

      <section className="staff-intro" aria-label="Staff account">
        <span>{name}</span>
        <button className="staff-switch-button" type="button">
          Not you?
        </button>
      </section>

      {message && <p className="orders-closed">{message}</p>}

      <section className="menu-section" aria-labelledby="menu-title">
        <h1 id="menu-title">TODAY'S MENU</h1>
        <div className="menu-list">
          {state.menu.map((item) => (
            <div
              className={`menu-item${activeOrder?.dishId === item.id ? ' menu-item-selected' : ''}`}
              key={item.id}
              role="button"
              tabIndex={activeOrder ? -1 : 0}
              onClick={() => !activeOrder && update(() => createOrder(name, item.id))}
            >
              <span
                className="menu-radio"
                aria-hidden="true"
              />
              <span className="menu-name">{item.name}</span>
              <span className="menu-price">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>

      {activeOrder && (
        <section className="order-status" aria-label="Order status">
          <span className="order-check" aria-hidden="true">✓</span>
          <span>Order placed — {activeOrder.dishName}</span>
          <button type="button" onClick={() => update(() => cancelOrder(activeOrder.id))}>
            Cancel
          </button>
        </section>
      )}
    </main>
  )
}

export default StaffScreen
