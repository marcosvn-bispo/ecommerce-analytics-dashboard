import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Users from './components/Users'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on tab change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeTab])

  return (
    <div className="app-container">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen} 
      />
      
      <div className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
            <h1>
              {activeTab === 'dashboard' && 'Business Intelligence'}
              {activeTab === 'users' && 'Análise de Clientes (LTV)'}
            </h1>
          </div>
        </header>
        
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'users' && <Users />}
      </div>
    </div>
  )
}

export default App
