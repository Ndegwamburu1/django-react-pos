import { useMemo, useState } from 'react'

const reportConfigs = {
  'Profit / Loss Report': {
    title: 'Profit / Loss Report',
    subtitle: 'View revenue, expenses, and net profit',
    summary: [
      ['Total Sales', 'KES 482,500.00'],
      ['Total Expenses', 'KES 125,000.00'],
      ['Net Profit', 'KES 357,500.00'],
    ],
    columns: ['Date', 'Sales', 'Expenses', 'Profit'],
    rows: [
      ['2026-06-10', 'KES 45,000.00', 'KES 5,000.00', 'KES 40,000.00'],
    ],
  },
  'Product Stock Report': {
    title: 'Product Stock Report',
    subtitle: 'Review stock levels and reorder needs',
    summary: [
      ['Total Products', '128'],
      ['Low Stock', '6'],
      ['Stock Value', 'KES 850,000.00'],
    ],
    columns: ['Product', 'Category', 'Current Stock', 'Reorder Level', 'Status'],
    rows: [
      ['White Bread 600g', 'Bakery', '42', '20', 'OK'],
      ['Fresh Milk 500ml', 'Dairy', '8', '20', 'Low Stock'],
    ],
  },
  'Sales Report': {
    title: 'Sales Report',
    subtitle: 'Track sales activity and revenue',
    summary: [
      ['Total Sales', 'KES 482,500.00'],
      ['Orders', '342'],
      ['Average Sale', 'KES 1,411.00'],
    ],
    columns: ['Date', 'Invoice', 'Customer', 'Total', 'Payment'],
    rows: [
      ['2026-06-10', 'INV2026/0001', 'Walk-in Customer', 'KES 1,250.00', 'Cash'],
    ],
  },
  'Purchase Report': {
    title: 'Purchase Report',
    subtitle: 'Track supplier purchases',
    summary: [
      ['Total Purchases', 'KES 285,000.00'],
      ['Orders', '28'],
      ['Due', 'KES 21,460.00'],
    ],
    columns: ['Date', 'Reference', 'Supplier', 'Total', 'Payment'],
    rows: [
      ['2026-06-07', 'PO2026/0001', 'john meat suppliers', 'KES 21,460.00', 'Due'],
    ],
  },
  'Customer / Supplier Report': {
    title: 'Customer / Supplier Report',
    subtitle: 'Review contact balances and activity',
    summary: [
      ['Customers', '185'],
      ['Suppliers', '12'],
      ['Balances Due', 'KES 21,460.00'],
    ],
    columns: ['Name', 'Type', 'Phone', 'Balance', 'Status'],
    rows: [
      ['john meat suppliers', 'Supplier', '0722 000 000', 'KES 21,460.00', 'Active'],
      ['Walk-in Customer', 'Customer', '-', 'KES 0.00', 'Active'],
    ],
  },
  'Tax Report': {
    title: 'Tax Report',
    subtitle: 'Review VAT and taxable sales',
    summary: [
      ['VAT Collected', 'KES 77,200.00'],
      ['Taxable Sales', 'KES 482,500.00'],
      ['VAT Payable', 'KES 45,600.00'],
    ],
    columns: ['Date', 'Tax Name', 'Tax Rate', 'Taxable Amount', 'Tax Amount'],
    rows: [
      ['2026-06-10', 'VAT', '16%', 'KES 10,000.00', 'KES 1,600.00'],
    ],
  },
  'Trending Products': {
    title: 'Trending Products',
    subtitle: 'See fastest moving products',
    summary: [
      ['Top Product', 'White Bread 600g'],
      ['Units Sold', '245'],
      ['Revenue', 'KES 20,825.00'],
    ],
    columns: ['Rank', 'Product', 'Category', 'Sold', 'Revenue'],
    rows: [
      ['1', 'White Bread 600g', 'Bakery', '245', 'KES 20,825.00'],
      ['2', 'Fresh Milk 500ml', 'Dairy', '189', 'KES 12,285.00'],
    ],
  },
}

function exportCsv(title, columns, rows) {
  const csv = [columns, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${title.toLowerCase().replaceAll(' ', '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function Reports({ activePage, setStatus }) {
  const config = reportConfigs[activePage] || reportConfigs['Sales Report']
  const [query, setQuery] = useState('')
  const [dateRange, setDateRange] = useState({
    from: '2026-06-01',
    to: '2026-06-10',
  })

  const visibleRows = useMemo(() => {
    return config.rows.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [config.rows, query])

  function generateReport() {
    setStatus(`${config.title} generated for ${dateRange.from} to ${dateRange.to}.`)
  }

  function handleExport() {
    exportCsv(config.title, config.columns, visibleRows)
    setStatus(`${config.title} exported.`)
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>{config.title}</h3>
          <span>{config.subtitle}</span>
        </div>

        <button onClick={generateReport}>Generate Report</button>
      </div>

      <form className="user-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          From
          <input
            type="date"
            value={dateRange.from}
            onChange={(event) => setDateRange({ ...dateRange, from: event.target.value })}
          />
        </label>

        <label>
          To
          <input
            type="date"
            value={dateRange.to}
            onChange={(event) => setDateRange({ ...dateRange, to: event.target.value })}
          />
        </label>

        <button type="button" onClick={generateReport}>
          Apply Filter
        </button>

        <button type="button" onClick={handleExport}>
          Export CSV
        </button>

        <button type="button" onClick={() => window.print()}>
          Print
        </button>
      </form>

      <div className="kpi-grid">
        {config.summary.map(([label, value]) => (
          <div className="kpi-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="users-card">
        <div className="users-card-header">
          <strong>{config.title} Details</strong>
        </div>

        <div className="users-toolbar">
          <label>
            Show
            <select defaultValue="25">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            entries
          </label>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ..."
          />
        </div>

        <div className="data-table">
          <div
            className="table-row header"
            style={{ gridTemplateColumns: `repeat(${config.columns.length}, minmax(130px, 1fr))` }}
          >
            {config.columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          {visibleRows.map((row) => (
            <div
              className="table-row"
              key={row.join('-')}
              style={{ gridTemplateColumns: `repeat(${config.columns.length}, minmax(130px, 1fr))` }}
            >
              {row.map((cell, index) => (
                <span key={`${cell}-${index}`}>{cell}</span>
              ))}
            </div>
          ))}

          {visibleRows.length === 0 && (
            <div className="home-empty-row">
              No report data found for this filter.
            </div>
          )}
        </div>

        <div className="users-footer">
          <span>
            Showing {visibleRows.length ? 1 : 0} to {visibleRows.length} of {visibleRows.length} entries
          </span>

          <div className="users-pagination">
            <button disabled={visibleRows.length === 0}>Previous</button>
            {visibleRows.length > 0 && <button className="active">1</button>}
            <button disabled={visibleRows.length === 0}>Next</button>
          </div>
        </div>
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}