import { useState } from 'react'
import NameGate from './NameGate'
import StaffScreen from './StaffScreen'

function App() {
  const [showStaffScreen, setShowStaffScreen] = useState(false)

  return showStaffScreen ? (
    <StaffScreen />
  ) : (
    <NameGate onContinue={() => setShowStaffScreen(true)} />
  )
}

export default App
