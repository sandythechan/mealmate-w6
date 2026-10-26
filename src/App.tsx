import { useState } from 'react'
import AdminScreen from './AdminScreen'
import NameGate from './NameGate'
import StaffScreen from './StaffScreen'

function App() {
  const [name, setName] = useState(() => localStorage.getItem('mealmate-name') ?? '')
  const [screen, setScreen] = useState<'staff' | 'admin'>('staff')

  const handleNameSubmit = (submittedName: string) => {
    localStorage.setItem('mealmate-name', submittedName)
    setName(submittedName)
  }

  if (!name) {
    return <NameGate onContinue={handleNameSubmit} />
  }

  if (screen === 'admin') {
    return <AdminScreen onStaffSelect={() => setScreen('staff')} />
  }

  return <StaffScreen name={name} onAdminSelect={() => setScreen('admin')} />
}

export default App
