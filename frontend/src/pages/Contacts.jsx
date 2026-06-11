import { useMemo, useState } from 'react'

const contactConfigs = {
  Suppliers: {
    title: 'Suppliers',
    subtitle: 'Manage suppliers',
    addLabel: '+ Add Supplier',
    fields: ['Name', 'Phone', 'Email', 'Address', 'Opening Balance'],
    startingRows: [
      ['john meat suppliers', '0722 000 000', 'supplier@example.com', 'Nairobi', 'KES 21,460.00'],
    ],
  },
  Customers: {
    title: 'Customers',
    subtitle: 'Manage customers',
    addLabel: '+ Add Customer',
    fields: ['Name', 'Phone', 'Email', 'Customer Group', 'Credit Limit'],
    startingRows: [
      ['Walk-in Customer', '-', '-', 'Retail', 'KES 0.00'],
    ],
  },
  'Customer Groups': {
    title: 'Customer Groups',
    subtitle: 'Manage customer groups',
    addLabel: '+ Add Group',
    fields: ['Name', 'Discount %', 'Description'],
    startingRows: [
      ['Retail', '0', 'Default customer group'],
      ['Wholesale', '5', 'Wholesale customers'],
    ],
  },
}

function LocalContactPage({ config, setStatus }) {
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

      <div className="users-card">
        <div className="users-card-header">
          <strong>All {config.title.toLowerCase()}</strong>
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
              No {config.title.toLowerCase()} found. Click {config.addLabel} to create one.
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

function ImportContacts({ setStatus }) {
  const [fileName, setFileName] = useState('')
  const [imported, setImported] = useState(false)

  function handleFileChange(event) {
    const file = event.target.files[0]
    setFileName(file ? file.name : '')
    setImported(false)
  }

  function importContacts() {
    if (!fileName) {
      setStatus('Choose a CSV or Excel file before importing contacts.')
      return
    }

    setImported(true)
    setStatus(`${fileName} prepared for import. Backend import will be connected later.`)
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Import Contacts</h3>
          <span>Import suppliers and customers from a file</span>
        </div>

        <button onClick={importContacts}>Import Contacts</button>
      </div>

      <div className="users-card">
        <div className="users-card-header">
          <strong>Upload contact file</strong>
        </div>

        <form className="user-form">
          <label>
            CSV or Excel file
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
          </label>

          <button type="button" onClick={importContacts}>
            Preview Import
          </button>
        </form>

        <div className="home-empty-row">
          {fileName ? `Selected file: ${fileName}` : 'No file selected yet.'}
        </div>

        {imported && (
          <div className="home-empty-row">
            File preview is ready. Database import will be connected when contacts API is created.
          </div>
        )}
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}

export default function Contacts({ activePage, setStatus }) {
  if (activePage === 'Import Contacts') {
    return <ImportContacts setStatus={setStatus} />
  }

  const config = contactConfigs[activePage]

  if (!config) {
    return (
      <div className="content-panel users-page">
        <div className="users-title">
          <div>
            <h3>Contacts</h3>
            <span>Select a contact page from the sidebar.</span>
          </div>
        </div>
      </div>
    )
  }

  return <LocalContactPage config={config} setStatus={setStatus} />
}