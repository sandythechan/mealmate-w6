import './StaffScreen.css'

type StaffScreenProps = {
  onAdminSelect: () => void
}

const menuItems = [
  { name: 'Grilled Chicken Wrap', price: '$9.50', selected: false },
  { name: 'Caesar Salad', price: '$8.00', selected: true },
  { name: 'Falafel Bowl', price: '$8.50', selected: false },
]

function StaffScreen({ onAdminSelect }: StaffScreenProps) {
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
        <span>Leo Yeung</span>
        <span className="staff-demo">DEMO</span>
        <a href="#switch-user">Not you?</a>
      </section>

      <p className="orders-closed">Orders closed — cutoff was 10:30 AM</p>

      <section className="menu-section" aria-labelledby="menu-title">
        <h1 id="menu-title">TODAY'S MENU</h1>
        <div className="menu-list">
          {menuItems.map((item) => (
            <div
              className={`menu-item${item.selected ? ' menu-item-selected' : ''}`}
              key={item.name}
            >
              <span
                className="menu-radio"
                aria-hidden="true"
              />
              <span className="menu-name">{item.name}</span>
              <span className="menu-price">{item.price}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="order-status" aria-label="Order status">
        <span className="order-check" aria-hidden="true">
          ✓
        </span>
        <span>Order placed — Caesar Salad</span>
      </section>

      <section className="lunch-spend" aria-labelledby="spend-title">
        <h2 id="spend-title">YOUR LUNCH SPEND - AUGUST 2026</h2>
        <strong>$8.00</strong>
      </section>
    </main>
  )
}

export default StaffScreen
