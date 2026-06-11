import { useMemo, useState } from 'react'

const sellConfigs = {
  'All Sales': {
    title: 'All Sales',
    subtitle: 'Manage completed and active sales',
    addLabel: '+ Add Sale',
    fields: ['Customer', 'Invoice No', 'Date', 'Total', 'Payment Status', 'Sale Status'],
    startingRows: [
      ['Walk-in Customer', 'INV2026/0001', '2026-06-10', 'KES 0.00', 'Paid', 'Completed'],
    ],
  },
  'List Drafts': {
    title: 'Drafts',
    subtitle: 'Saved sales waiting to be completed',
    addLabel: '+ Add Draft',
    fields: ['Customer', 'Draft No', 'Date', 'Total', 'Status'],
    startingRows: [
      ['Walk-in Customer', 'DRAFT2026/0001', '2026-06-10', 'KES 0.00', 'Draft'],
    ],
  },
  'List Quotations': {
    title: 'Quotations',
    subtitle: 'Manage customer quotations',
    addLabel: '+ Add Quotation',
    fields: ['Customer', 'Quotation No', 'Date', 'Total', 'Status'],
    startingRows: [
      ['Walk-in Customer', 'QUOT2026/0001', '2026-06-10', 'KES 0.00', 'Pending'],
    ],
  },
  'Sell Return': {
    title: 'Sell Returns',
    subtitle: 'Manage returned sales',
    addLabel: '+ Add Return',
    fields: ['Customer', 'Invoice No', 'Date', 'Amount', 'Reason'],
    startingRows: [],
  },
  Shipments: {
    title: 'Shipments',
    subtitle: 'Track outgoing deliveries',
    addLabel: '+ Add Shipment',
    fields: ['Customer', 'Invoice No', 'Date', 'Shipping Status', 'Payment Status'],
    startingRows: [],
  },
  Discounts: {
    title: 'Discounts',
    subtitle: 'Manage sale discounts',
    addLabel: '+ Add Discount',
    fields: ['Name', 'Type', 'Value', 'Start Date', 'End Date'],
    startingRows: [
      ['Weekend Offer', 'Percentage', '5', '2026-06-10', '2026-06-30'],
    ],
  },
  Subscriptions: {
    title: 'Subscriptions',
    subtitle: 'Manage recurring customer sales',
    addLabel: '+ Add Subscription',
    fields: ['Customer', 'Plan', 'Frequency', 'Next Billing', 'Status'],
    startingRows: [],
  },
}

function LocalSellPage({ config, setStatus }) {
  const [rows, setRows] = useState(config.startingRows)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [form, setForm] = useState(() => config.fields.map(() => ''))

  const visibleRows = useMemo(() => {
    return rows.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [rows, query])

  function resetForm() {
    setForm(config.fields.map(() => ''))
    setEditingIndex(null)
    setShowForm(false)
  }

  function saveRow(event) {
    event.preventDefault()

    const cleanForm = form.map((value) => value.trim())

    if (!cleanForm[0]) {
      setStatus(`${config.title} customer/name is required.`)
      return
    }

    if (editingIndex !== null) {
      setRows((currentRows) =>
        currentRows.map((row, index) => (index === editingIndex ? cleanForm : row)),
      )
      setQuery('')
      setStatus(`${config.title} updated and visible in the table.`)
      resetForm()
      return
    }

    setRows((currentRows) => [...currentRows, cleanForm])
    setQuery('')
    setStatus(`${config.title} added and visible in the table.`)
    resetForm()
  }

  function editRow(row, index) {
    setForm(row)
    setEditingIndex(index)
    setShowForm(true)
    setStatus(`${config.title} loaded for editing.`)
  }

  function deleteRow(index) {
    setRows((currentRows) => currentRows.filter((row, rowIndex) => rowIndex !== index))
    setStatus(`${config.title} deleted.`)
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>{config.title}</h3>
          <span>{config.subtitle}</span>
        </div>

        <button onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? 'Close' : config.addLabel}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={saveRow}>
          {config.fields.map((field, index) => (
            <label key={field}>
              {field}
              <input
                value={form[index]}
                onChange={(event) => {
                  const nextForm = [...form]
                  nextForm[index] = event.target.value
                  setForm(nextForm)
                }}
                required={index === 0}
              />
            </label>
          ))}

          <button type="submit">
            {editingIndex !== null ? `Update ${config.title}` : `Save ${config.title}`}
          </button>
        </form>
      )}

      <div className="users-card">
        <div className="users-card-header">
          <strong>{config.title}</strong>
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
            style={{ gridTemplateColumns: `repeat(${config.fields.length + 1}, minmax(130px, 1fr))` }}
          >
            {config.fields.map((field) => (
              <span key={field}>{field}</span>
            ))}
            <span>Action</span>
          </div>

          {visibleRows.map((row, index) => (
            <div
              className="table-row"
              key={row.join('-')}
              style={{ gridTemplateColumns: `repeat(${config.fields.length + 1}, minmax(130px, 1fr))` }}
            >
              {row.map((cell, cellIndex) => (
                <span key={`${cell}-${cellIndex}`}>{cell}</span>
              ))}

              <span className="users-actions">
                <button onClick={() => editRow(row, index)}>Edit</button>
                <button onClick={() => deleteRow(index)}>Delete</button>
              </span>
            </div>
          ))}

          {visibleRows.length === 0 && (
            <div className="home-empty-row">
              No records found. Click {config.addLabel} to create one.
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

function AddSale({ setStatus, setActivePage }) {
  const [saleForm, setSaleForm] = useState({
    customer: 'Walk-in Customer',
    invoice: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Cash',
    note: '',
  })

  function saveSale(event) {
    event.preventDefault()
    setStatus('Sale draft created. Open POS to add products and complete checkout.')
    setActivePage('POS')
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Add Sale</h3>
          <span>Create a sale header before opening POS checkout</span>
        </div>

        <button onClick={() => setActivePage('POS')}>Open POS</button>
      </div>

      <form className="user-form" onSubmit={saveSale}>
        <label>
          Customer
          <input
            value={saleForm.customer}
            onChange={(event) => setSaleForm({ ...saleForm, customer: event.target.value })}
            required
          />
        </label>

        <label>
          Invoice No
          <input
            value={saleForm.invoice}
            onChange={(event) => setSaleForm({ ...saleForm, invoice: event.target.value })}
            placeholder="Auto if empty"
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={saleForm.date}
            onChange={(event) => setSaleForm({ ...saleForm, date: event.target.value })}
          />
        </label>

        <label>
          Payment Method
          <select
            value={saleForm.paymentMethod}
            onChange={(event) => setSaleForm({ ...saleForm, paymentMethod: event.target.value })}
          >
            <option>Cash</option>
            <option>M-Pesa</option>
            <option>Card</option>
            <option>Credit</option>
          </select>
        </label>

        <label>
          Sale note
          <input
            value={saleForm.note}
            onChange={(event) => setSaleForm({ ...saleForm, note: event.target.value })}
          />
        </label>

        <button type="submit">Save And Continue To POS</button>
      </form>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}

export default function Sell({ activePage, setStatus, setActivePage }) {
  if (activePage === 'Add Sale') {
    return <AddSale setStatus={setStatus} setActivePage={setActivePage} />
  }

  const config = sellConfigs[activePage]

  if (!config) {
    return (
      <div className="content-panel users-page">
        <div className="users-title">
          <div>
            <h3>Sell</h3>
            <span>Select a sell page from the sidebar.</span>
          </div>
        </div>
      </div>
    )
  }

  return <LocalSellPage config={config} setStatus={setStatus} />
}