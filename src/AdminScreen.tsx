import './AdminScreen.css'

type AdminScreenProps = {
  onStaffSelect: () => void
}

const menuItems = [
  { name: 'Grilled Chicken Wrap', price: '$9.50', ordered: 0 },
  { name: 'Caesar Salad', price: '$8.00', ordered: 1 },
  { name: 'Falafel Bowl', price: '$8.50', ordered: 0 },
]

function AdminScreen({ onStaffSelect }: AdminScreenProps) {
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
        <form className="publish-form">
          <label htmlFor="dish-name">Dish name</label>
          <input
            id="dish-name"
            name="dish-name"
            type="text"
            placeholder="e.g. Grilled Chicken Wrap"
          />

          <label htmlFor="dish-price">Price ($)</label>
          <input
            id="dish-price"
            name="dish-price"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
          />

          <button type="submit" disabled>
            Add to Menu
          </button>
        </form>
      </section>

      <section className="admin-menu" aria-labelledby="admin-menu-title">
        <h2 id="admin-menu-title">MENU · 3 DISHES</h2>
        <div className="admin-menu-list">
          {menuItems.map((item) => (
            <div className="admin-menu-item" key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.price}</span>
              </div>
              <div className="ordered-count">
                <strong>{item.ordered}</strong>
                <span>ordered</span>
              </div>
              <button
                className="remove-dish"
                type="button"
                aria-label={`Remove ${item.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <p className="orders-today">1 order today</p>
    </main>
  )
}

export default AdminScreen
