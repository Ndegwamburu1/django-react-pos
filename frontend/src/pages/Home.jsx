import { useState } from 'react'

function HomeTable({ title, columns, rows = [], onExport }) {
  const [query, setQuery] = useState('')
  const [showColumns, setShowColumns] = useState(false)

  const filteredRows = rows.filter((row) =>
    row.join(' ').toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section className="home-box">
      <div className="home-box-title">
        <div className="home-icon">#</div>
        <h3>{title}</h3>
      </div>

      <div className="home-table-tools">
        <label>
          Show
          <select defaultValue="25">
            <option>25</option>
            <option>50</option>
            <option>100</option>
            <option>200</option>
            <option>500</option>
            <option>1000</option>
            <option>All</option>
          </select>
          entries
        </label>

        <div className="export-buttons">
          <button onClick={() => onExport(title, columns, filteredRows)}>Export CSV</button>
          <button onClick={() => onExport(title, columns, filteredRows)}>Export Excel</button>
          <button onClick={() => window.print()}>Print</button>
          <button onClick={() => setShowColumns((open) => !open)}>Column visibility</button>
          <button onClick={() => window.print()}>Export PDF</button>
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ..."
        />
      </div>

      {showColumns && (
        <div className="column-visibility">
          {columns.map((column) => (
            <label key={column}>
              <input type="checkbox" checked readOnly />
              {column}
            </label>
          ))}
        </div>
      )}

      <div className="home-data-table">
        <div
          className="home-table-row home-table-head"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(130px, 1fr))` }}
        >
          {columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>

        {filteredRows.length === 0 ? (
          <div className="home-empty-row">No data available in table</div>
        ) : (
          filteredRows.map((row) => (
            <div
              className="home-table-row"
              key={row.join('-')}
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(130px, 1fr))` }}
            >
              {row.map((cell, index) => (
                <span key={`${cell}-${index}`}>{cell}</span>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="home-table-footer">
        <span>
          Showing {filteredRows.length ? 1 : 0} to {filteredRows.length} of {filteredRows.length} entries
        </span>

        <div className="users-pagination">
          <button disabled={filteredRows.length === 0}>Previous</button>
          {filteredRows.length > 0 && <button className="active">1</button>}
          <button disabled={filteredRows.length === 0}>Next</button>
        </div>
      </div>
    </section>
  )
}

export default function Home({
  homeDate,
  setHomeDate,
  showCalculator,
  setShowCalculator,
  showProfit,
  setShowProfit,
  showNotifications,
  setShowNotifications,
  sidebarCollapsed,
  setSidebarCollapsed,
  setActivePage,
  setStatus,
}) {
  const dashboardRows = [
    ['john meat suppliers', 'PO2026/0001', 'KSh 21,460.00', 'View'],
  ]

  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  function exportRows(title, columns, rows) {
    const csv = [
      title,
      columns.join(','),
      ...(rows.length ? rows.map((row) => row.join(',')) : ['No data available in table']),
    ].join('\n')

    downloadFile(`${title.toLowerCase().replaceAll(' ', '-')}.csv`, csv)
    setStatus(`${title} exported.`)
  }

  return (
    <div className="content-panel live-home">
      <div className="home-topbar">
        <button onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}>
          {sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        </button>

        <button onClick={() => setShowCalculator((open) => !open)}>
          Calculator
        </button>

        <button onClick={() => setActivePage('POS')}>
          POS
        </button>

        <button onClick={() => setShowProfit((open) => !open)}>
          Today's Profit
        </button>

        <div className="home-date">{homeDate}</div>

        <button onClick={() => setShowNotifications((open) => !open)}>
          Notifications
        </button>

        <div className="home-user">Moi</div>
      </div>

      {showCalculator && (
        <div className="home-panel">
          <strong>Calculator</strong>
          <input placeholder="Type calculation, e.g. 1200 + 450" />
          <button onClick={() => setStatus('Calculator result will be added next.')}>Calculate</button>
        </div>
      )}

      {showProfit && (
        <div className="home-panel">
          <strong>Today's Profit</strong>
          <span>Total Sales: KSh 0.00</span>
          <span>Expenses: KSh 0.00</span>
          <span>Net Profit: KSh 0.00</span>
        </div>
      )}

      {showNotifications && (
        <div className="home-panel">
          <strong>Notifications</strong>
          <span>No new notifications.</span>
        </div>
      )}

      <div className="welcome-row">
        <div>
          <h3>Welcome Moses,</h3>
          <span>Techaiot POS dashboard</span>
        </div>

        <label>
          Filter by date
          <input
            type="date"
            value={homeDate}
            onChange={(event) => {
              setHomeDate(event.target.value)
              setStatus(`Dashboard filtered to ${event.target.value}.`)
            }}
          />
        </label>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><span>Total Sales</span><strong>KSh 0.00</strong></div>
        <div className="kpi-card"><span>Net</span><strong>KSh 0.00</strong></div>
        <div className="kpi-card"><span>Invoice due</span><strong>KSh 0.00</strong></div>
        <div className="kpi-card"><span>Total Sell Return</span><strong>KSh 0.00</strong></div>
        <div className="kpi-card"><span>Total purchase</span><strong>KSh 0.00</strong></div>
        <div className="kpi-card"><span>Purchase due</span><strong>KSh 0.00</strong></div>
        <div className="kpi-card"><span>Total Purchase Return</span><strong>KSh 0.00</strong></div>
        <div className="kpi-card"><span>Expense</span><strong>KSh 0.00</strong></div>
      </div>

      <div className="chart-grid">
        <section className="home-box">
          <div className="home-box-title">
            <div className="home-icon">o</div>
            <h3>Sales Last 30 Days</h3>
          </div>
          <div className="chart-placeholder">Sales chart preview</div>
        </section>

        <section className="home-box">
          <div className="home-box-title">
            <div className="home-icon">o</div>
            <h3>Sales Current Financial Year</h3>
          </div>
          <div className="chart-placeholder">Financial year chart preview</div>
        </section>
      </div>

      <HomeTable
        title="Sales Payment Due"
        columns={['Customer', 'Invoice No.', 'Due Amount', 'Action']}
        rows={[]}
        onExport={exportRows}
      />

      <HomeTable
        title="Purchase Payment Due"
        columns={['Supplier', 'Reference No', 'Due Amount', 'Action']}
        rows={dashboardRows}
        onExport={exportRows}
      />

      <HomeTable
        title="Product Stock Alert"
        columns={['Product', 'Location', 'Current stock']}
        rows={[]}
        onExport={exportRows}
      />

      <HomeTable
        title="Sales Order"
        columns={['Action', 'Date', 'Order No.', 'Customer name', 'Contact Number', 'Location', 'Status', 'Shipping Status', 'Quantity Remaining', 'Added By']}
        rows={[]}
        onExport={exportRows}
      />

      <HomeTable
        title="Pending Shipments"
        columns={['Action', 'Date', 'Invoice No.', 'Customer name', 'Contact Number', 'Location', 'Shipping Status', 'Payment Status']}
        rows={[]}
        onExport={exportRows}
      />

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}