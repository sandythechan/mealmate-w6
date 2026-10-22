import { useState } from 'react'
import AdminScreen from './AdminScreen'
import NameGate from './NameGate'
import StaffScreen from './StaffScreen'

function App() {
  const [screen, setScreen] = useState<'name-gate' | 'staff' | 'admin'>(
    'name-gate',
  )

  if (screen === 'name-gate') {
    return <NameGate onContinue={() => setScreen('staff')} />
  }

  if (screen === 'admin') {
    return <AdminScreen onStaffSelect={() => setScreen('staff')} />
  }

  return <StaffScreen onAdminSelect={() => setScreen('admin')} />
}

export default App
