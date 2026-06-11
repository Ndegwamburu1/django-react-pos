import { useMemo, useState } from 'react'

const settingConfigs = {
  'Business Locations': {
    title: 'Business Locations',
    subtitle: 'Manage store branches and counters',
    addLabel: '+ Add Location',
    fields: ['Name', 'Address', 'Phone', 'Status'],
    rows: [
      ['Main Store', 'Nairobi', '0722 000 000', 'Active'],
      ['Counter 01', 'Main Store', '0722 000 001', 'Active'],
    ],
  },
  'Receipt Printers': {
    title: 'Receipt Printers',
    subtitle: 'Manage receipt and label printers',
    addLabel: '+ Add Printer',
    fields: ['Printer Name', 'Type', 'Connection', 'Status'],
    rows: [
      ['Receipt Printer 1', 'Thermal', 'USB', 'Connected'],
    ],
  },
  'Tax Rates': {
    title: 'Tax Rates',
    subtitle: 'Manage tax names and percentages',
    addLabel: '+ Add Tax Rate',
    fields: ['Tax Name', 'Rate %', 'Type', 'Status'],
    rows: [
      ['VAT', '16', 'Percentage', 'Active'],
    ],
  },
}

function LocalSettingsTable({ config, setStatus }) {
  const [rows, setRows] = useState(config.rows)
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
      setStatus(`${config.title} name is required.`)
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

      <SettingsTable
        title={`All ${config.title.toLowerCase()}`}
        columns={[...config.fields, 'Action']}
        rows={visibleRows}
        query={query}
        setQuery={setQuery}
        onEdit={editRow}
        onDelete={deleteRow}
      />
    </div>
  )
}

function BusinessSettings({ setStatus }) {
  const [form, setForm] = useState({
    businessName: 'Techaiot POS',
    phone: '0722 000 000',
    email: 'info@techaiot.local',
    address: 'Nairobi, Kenya',
    currency: 'KES',
    financialYearStart: '2026-01-01',
  })

  function saveSettings(event) {
    event.preventDefault()
    setStatus('Business settings saved locally.')
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Business Settings</h3>
          <span>Manage business profile and defaults</span>
        </div>

        <button onClick={saveSettings}>Save Settings</button>
      </div>

      <form className="user-form" onSubmit={saveSettings}>
        <label>
          Business Name
          <input
            value={form.businessName}
            onChange={(event) => setForm({ ...form, businessName: event.target.value })}
            required
          />
        </label>

        <label>
          Phone
          <input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>

        <label>
          Address
          <input
            value={form.address}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
          />
        </label>

        <label>
          Currency
          <select
            value={form.currency}
            onChange={(event) => setForm({ ...form, currency: event.target.value })}
          >
            <option>KES</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </label>

        <label>
          Financial Year Start
          <input
            type="date"
            value={form.financialYearStart}
            onChange={(event) => setForm({ ...form, financialYearStart: event.target.value })}
          />
        </label>

        <button type="submit">Save Business Settings</button>
      </form>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}

function InvoiceSettings({ setStatus }) {
  const [form, setForm] = useState({
    prefix: 'INV',
    startingNumber: '1001',
    dueDays: '30',
    footerText: 'Thank you for your business.',
  })

  function saveSettings(event) {
    event.preventDefault()
    setStatus('Invoice settings saved locally.')
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Invoice Settings</h3>
          <span>Manage invoice numbering and receipt footer</span>
        </div>

        <button onClick={saveSettings}>Save Settings</button>
      </div>

      <form className="user-form" onSubmit={saveSettings}>
        <label>
          Invoice Prefix
          <input
            value={form.prefix}
            onChange={(event) => setForm({ ...form, prefix: event.target.value })}
            required
          />
        </label>

        <label>
          Starting Number
          <input
            type="number"
            value={form.startingNumber}
            onChange={(event) => setForm({ ...form, startingNumber: event.target.value })}
            required
          />
        </label>

        <label>
          Default Due Days
          <input
            type="number"
            value={form.dueDays}
            onChange={(event) => setForm({ ...form, dueDays: event.target.value })}
          />
        </label>

        <label>
          Footer Text
          <input
            value={form.footerText}
            onChange={(event) => setForm({ ...form, footerText: event.target.value })}
          />
        </label>

        <button type="submit">Save Invoice Settings</button>
      </form>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}

function BarcodeSettings({ setStatus }) {
  const [form, setForm] = useState({
    symbology: 'Code 128',
    labelWidth: '50',
    labelHeight: '25',
    copies: '1',
  })

  function saveSettings(event) {
    event.preventDefault()
    setStatus('Barcode settings saved locally.')
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Barcode Settings</h3>
          <span>Manage barcode label defaults</span>
        </div>

        <button onClick={saveSettings}>Save Settings</button>
      </div>

      <form className="user-form" onSubmit={saveSettings}>
        <label>
          Symbology
          <select
            value={form.symbology}
            onChange={(event) => setForm({ ...form, symbology: event.target.value })}
          >
            <option>Code 128</option>
            <option>Code 39</option>
            <option>EAN-13</option>
            <option>UPC-A</option>
          </select>
        </label>

        <label>
          Label Width
          <input
            type="number"
            value={form.labelWidth}
            onChange={(event) => setForm({ ...form, labelWidth: event.target.value })}
          />
        </label>

        <label>
          Label Height
          <input
            type="number"
            value={form.labelHeight}
            onChange={(event) => setForm({ ...form, labelHeight: event.target.value })}
          />
        </label>

        <label>
          Default Copies
          <input
            type="number"
            value={form.copies}
            onChange={(event) => setForm({ ...form, copies: event.target.value })}
          />
        </label>

        <button type="submit">Save Barcode Settings</button>
      </form>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}

function SettingsTable({ title, columns, rows, query, setQuery, onEdit, onDelete }) {
  return (
    <div className="users-card">
      <div className="users-card-header">
        <strong>{title}</strong>
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
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(130px, 1fr))` }}
        >
          {columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>

        {rows.map((row, index) => (
          <div
            className="table-row"
            key={row.join('-')}
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(130px, 1fr))` }}
          >
            {row.map((cell, cellIndex) => (
              <span key={`${cell}-${cellIndex}`}>{cell}</span>
            ))}

            <span className="users-actions">
              <button onClick={() => onEdit(row, index)}>Edit</button>
              <button onClick={() => onDelete(index)}>Delete</button>
            </span>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="home-empty-row">
            No records found. Click the add button to create one.
          </div>
        )}
      </div>

      <div className="users-footer">
        <span>
          Showing {rows.length ? 1 : 0} to {rows.length} of {rows.length} entries
        </span>

        <div className="users-pagination">
          <button disabled={rows.length === 0}>Previous</button>
          {rows.length > 0 && <button className="active">1</button>}
          <button disabled={rows.length === 0}>Next</button>
        </div>
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}

export default function Settings({ activePage, setStatus }) {
  if (activePage === 'Business Settings') {
    return <BusinessSettings setStatus={setStatus} />
  }

  if (activePage === 'Invoice Settings') {
    return <InvoiceSettings setStatus={setStatus} />
  }

  if (activePage === 'Barcode Settings') {
    return <BarcodeSettings setStatus={setStatus} />
  }

  const config = settingConfigs[activePage]

  if (config) {
    return <LocalSettingsTable config={config} setStatus={setStatus} />
  }

  return null
}