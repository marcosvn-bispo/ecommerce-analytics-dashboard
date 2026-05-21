import React from 'react'
import { LayoutDashboard, Users as UsersIcon, Activity } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        <div className="brand" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={28} color="#60a5fa" />
            <span>Superstore BI</span>
          </div>
        </div>
        
        <nav style={{ marginTop: '24px' }}>
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <UsersIcon size={20} />
            <span>Clientes (LTV)</span>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
