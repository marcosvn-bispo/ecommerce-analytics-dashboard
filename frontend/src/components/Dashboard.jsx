import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp, ShoppingBag, DollarSign, Filter } from 'lucide-react'
import useSWR from 'swr'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']
const fetcher = url => fetch(url).then(res => res.json())

const Dashboard = () => {
  const [year, setYear] = useState('all')
  const [region, setRegion] = useState('all')

  const baseUrl = 'http://localhost:8000/api'
  const query = `?year=${year}&region=${region}`

  const { data: kpis, isLoading: loadingKpis } = useSWR(`${baseUrl}/kpis${query}`, fetcher)
  const { data: salesTrend, isLoading: loadingTrend } = useSWR(`${baseUrl}/sales-trend${query}`, fetcher)
  const { data: topProducts, isLoading: loadingProducts } = useSWR(`${baseUrl}/top-products${query}`, fetcher)
  const { data: categorySales, isLoading: loadingCategory } = useSWR(`${baseUrl}/sales-by-category${query}`, fetcher)

  const loading = loadingKpis || loadingTrend || loadingProducts || loadingCategory

  return (
    <div className="dashboard-grid">
      {/* Global Filters */}
      <div className="glass-panel" style={{ gridColumn: 'span 12', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
          <Filter size={20} />
          <span style={{ fontWeight: 600 }}>Filtros:</span>
        </div>
        
        <select value={year} onChange={e => setYear(e.target.value)} className="search-input" style={{ width: '150px' }}>
          <option value="all">Todos os Anos</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>

        <select value={region} onChange={e => setRegion(e.target.value)} className="search-input" style={{ width: '150px' }}>
          <option value="all">Todas as Regiões</option>
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="Central">Central</option>
          <option value="South">South</option>
        </select>
      </div>

      {loading ? (
        <>
          <div className="glass-panel kpi-card"><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text"></div></div>
          <div className="glass-panel kpi-card"><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text"></div></div>
          <div className="glass-panel kpi-card"><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-text"></div></div>
          <div className="glass-panel chart-container" style={{ gridColumn: 'span 12' }}><div className="skeleton skeleton-chart"></div></div>
        </>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="glass-panel kpi-card">
            <div className="kpi-header">
              <span>Vendas Totais</span>
              <DollarSign size={18} color="#3b82f6" />
            </div>
            <div className="kpi-value">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(kpis?.total_sales || 0)}
            </div>
          </div>

          <div className="glass-panel kpi-card">
            <div className="kpi-header">
              <span>Lucro Total</span>
              <TrendingUp size={18} color="#10b981" />
            </div>
            <div className="kpi-value">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(kpis?.total_profit || 0)}
            </div>
          </div>

          <div className="glass-panel kpi-card">
            <div className="kpi-header">
              <span>Total de Pedidos</span>
              <ShoppingBag size={18} color="#a78bfa" />
            </div>
            <div className="kpi-value">
              {new Intl.NumberFormat('en-US').format(kpis?.total_orders || 0)}
            </div>
          </div>

          {/* Sales & Profit Trend Chart */}
          <div className="glass-panel chart-container">
            <h3 className="chart-title">Receita vs Lucro (Evolução Temporal)</h3>
            <ResponsiveContainer key={`line-${year}-${region}`} width="100%" height={300}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" tickFormatter={(value) => `$${(value/1000)}k`} />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                />
                <Legend />
                <Line name="Vendas" type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls={true} />
                <Line name="Lucro" type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={false} connectNulls={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div className="glass-panel chart-container" style={{ gridColumn: 'span 4' }}>
            <h3 className="chart-title">Receita por Categoria</h3>
            <ResponsiveContainer key={`pie-${year}-${region}`} width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="category"
                >
                  {categorySales?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="glass-panel top-products" style={{ gridColumn: 'span 8' }}>
            <h3 className="chart-title">Top 5 Produtos em Receita</h3>
            <ul className="product-list">
              {topProducts?.map((product, index) => (
                <li key={index} className="product-item">
                  <div>
                    <div className="product-name" style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{product.product}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{product.category}</div>
                  </div>
                  <span className="product-sales">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
