import type { FormEvent } from 'react'
import './NameGate.css'

function NameGate() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="name-gate">
      <header className="name-gate-header">
        <strong>MealMate</strong>
        <span>FRI, AUG 14</span>
      </header>

      <nav className="name-gate-tabs" aria-label="Main navigation">
        <a className="name-gate-tab name-gate-tab-active" href="#staff">
          Staff
        </a>
        <a className="name-gate-tab" href="#admin">
          Admin
        </a>
      </nav>

      <section className="name-gate-content" aria-labelledby="welcome-title">
        <h1 id="welcome-title">Welcome to MealMate</h1>
        <p>Enter your name once and this device will remember you.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" placeholder="e.g. Jordan Lee" />
          <button type="submit">Continue</button>
        </form>
      </section>
    </main>
  )
}

export default NameGate
