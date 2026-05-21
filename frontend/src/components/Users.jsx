import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'

const fetcher = url => fetch(url).then(res => res.json())

const Users = () => {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const limit = 10

  const { data, isLoading } = useSWR(
    `http://localhost:8000/api/users?search=${debouncedSearch}&skip=${page * limit}&limit=${limit}`,
    fetcher
  )

  const users = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  // CSV Export functionality
  const exportToCSV = () => {
    // Agora consumimos do backend que envia TODOS os dados filtrados sem limite de página! (ELT)
    window.location.href = `http://localhost:8000/api/users/export?search=${debouncedSearch}`
  }

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>Análise de Clientes (Lifetime Value)</h2>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar cliente..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0) 
              }}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          
          <button className="btn" onClick={exportToCSV} title="Exportar CSV">
            <Download size={18} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome do Cliente</th>
              <th>Segmento</th>
              <th>Região (Estado)</th>
              <th>Lifetime Value (LTV)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>Carregando dados em cache...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>Nenhum cliente encontrado.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.customer_id}>
                  <td style={{ fontWeight: 500 }}>{user.customer_name}</td>
                  <td>{user.segment}</td>
                  <td>{user.region} ({user.state})</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.ltv)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && total > 0 && (
        <div className="pagination">
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Mostrando {page * limit + 1} até {Math.min((page + 1) * limit, total)} de {total} clientes únicos
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn" 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              className="btn" 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
