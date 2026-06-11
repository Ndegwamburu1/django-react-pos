import { useMemo, useState } from 'react'

const emptyTransferForm = {
  fromLocation: '',
  toLocation: '',
  product: '',
  quantity: '',
  date: '',
  status: 'Pending',
}

const emptyAdjustmentForm = {
  product: '',
  location: '',
  type: 'Increase',
  quantity: '',
  reason: '',
  date: '',
}

const startingTransfers = [
  ['Main Store', 'Counter 01', 'White Bread 600g', '10', '2026-06-10', 'Completed'],
]

const startingAdjustments = [
  ['Fresh Milk 500ml', 'Counter 01', 'Decrease', '2', 'Expired stock', '2026-06-10'],
]

export default function Stock({ activePage, setStatus }) {
  const [transfers, setTransfers] = useState(startingTransfers)
  const [adjustments, setAdjustments] = useState(startingAdjustments)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(
    activePage === 'Add Stock Transfer' || activePage === 'Add Stock Adjustment',
  )
  const [editingIndex, setEditingIndex] = useState(null)
  const [transferForm, setTransferForm] = useState(emptyTransferForm)
  const [adjustmentForm, setAdjustmentForm] = useState(emptyAdjustmentForm)

  const isTransferPage = activePage === 'List Stock Transfers' || activePage === 'Add Stock Transfer'
  const isAdjustmentPage = activePage === 'List Stock Adjustments' || activePage === 'Add Stock Adjustment'

  const visibleTransfers = useMemo(() => {
    return transfers.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [transfers, query])

  const visibleAdjustments = useMemo(() => {
    return adjustments.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [adjustments, query])

  function resetTransferForm() {
    setTransferForm(emptyTransferForm)
    setEditingIndex(null)
    setShowForm(false)
  }

  function resetAdjustmentForm() {
    setAdjustmentForm(emptyAdjustmentForm)
    setEditingIndex(null)
    setShowForm(false)
  }

  function openTransferForm() {
    setTransferForm(emptyTransferForm)
    setEditingIndex(null)
    setShowForm(true)
    setStatus('Stock transfer form opened.')
  }

  function openAdjustmentForm() {
    setAdjustmentForm(emptyAdjustmentForm)
    setEditingIndex(null)
    setShowForm(true)
    setStatus('Stock adjustment form opened.')
  }

  function saveTransfer(event) {
    event.preventDefault()

    if (!transferForm.fromLocation.trim() || !transferForm.toLocation.trim() || !transferForm.product.trim()) {
      setStatus('From location, to location, and product are required.')
      return
    }

    const row = [
      transferForm.fromLocation.trim(),
      transferForm.toLocation.trim(),
      transferForm.product.trim(),
      transferForm.quantity || '0',
      transferForm.date || new Date().toISOString().slice(0, 10),
      transferForm.status,
    ]

    if (editingIndex !== null) {
      setTransfers((currentRows) =>
        currentRows.map((transfer, index) => (index === editingIndex ? row : transfer)),
      )
      setQuery('')
      setStatus('Stock transfer updated and visible in the table.')
      resetTransferForm()
      return
    }

    setTransfers((currentRows) => [...currentRows, row])
    setQuery('')
    setStatus('Stock transfer added and visible in the table.')
    resetTransferForm()
  }

  function saveAdjustment(event) {
    event.preventDefault()

    if (!adjustmentForm.product.trim() || !adjustmentForm.location.trim()) {
      setStatus('Product and location are required.')
      return
    }

    const row = [
      adjustmentForm.product.trim(),
      adjustmentForm.location.trim(),
      adjustmentForm.type,
      adjustmentForm.quantity || '0',
      adjustmentForm.reason.trim() || '-',
      adjustmentForm.date || new Date().toISOString().slice(0, 10),
    ]

    if (editingIndex !== null) {
      setAdjustments((currentRows) =>
        currentRows.map((adjustment, index) => (index === editingIndex ? row : adjustment)),
      )
      setQuery('')
      setStatus('Stock adjustment updated and visible in the table.')
      resetAdjustmentForm()
      return
    }

    setAdjustments((currentRows) => [...currentRows, row])
    setQuery('')
    setStatus('Stock adjustment added and visible in the table.')
    resetAdjustmentForm()
  }

  function editTransfer(row, index) {
    setTransferForm({
      fromLocation: row[0],
      toLocation: row[1],
      product: row[2],
      quantity: row[3],
      date: row[4],
      status: row[5],
    })
    setEditingIndex(index)
    setShowForm(true)
    setStatus('Stock transfer loaded for editing.')
  }

  function editAdjustment(row, index) {
    setAdjustmentForm({
      product: row[0],
      location: row[1],
      type: row[2],
      quantity: row[3],
      reason: row[4],
      date: row[5],
    })
    setEditingIndex(index)
    setShowForm(true)
    setStatus('Stock adjustment loaded for editing.')
  }

  function deleteTransfer(index) {
    setTransfers((currentRows) => currentRows.filter((transfer, rowIndex) => rowIndex !== index))
    setStatus('Stock transfer deleted.')
  }

  function deleteAdjustment(index) {
    setAdjustments((currentRows) => currentRows.filter((adjustment, rowIndex) => rowIndex !== index))
    setStatus('Stock adjustment deleted.')
  }

  if (isAdjustmentPage) {
    return (
      <div className="content-panel users-page">
        <div className="users-title">
          <div>
            <h3>{activePage === 'Add Stock Adjustment' ? 'Add Stock Adjustment' : 'Stock Adjustments'}</h3>
            <span>Correct stock because of damage, expiry, loss, or physical count</span>
          </div>

          <button onClick={showForm ? resetAdjustmentForm : openAdjustmentForm}>
            {showForm ? 'Close' : '+ Add Adjustment'}
          </button>
        </div>

        {showForm && (
          <form className="user-form" onSubmit={saveAdjustment}>
            <label>
              Product
              <input
                value={adjustmentForm.product}
                onChange={(event) => setAdjustmentForm({ ...adjustmentForm, product: event.target.value })}
                required
              />
            </label>

            <label>
              Location
              <input
                value={adjustmentForm.location}
                onChange={(event) => setAdjustmentForm({ ...adjustmentForm, location: event.target.value })}
                required
              />
            </label>

            <label>
              Type
              <select
                value={adjustmentForm.type}
                onChange={(event) => setAdjustmentForm({ ...adjustmentForm, type: event.target.value })}
              >
                <option>Increase</option>
                <option>Decrease</option>
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                value={adjustmentForm.quantity}
                onChange={(event) => setAdjustmentForm({ ...adjustmentForm, quantity: event.target.value })}
                required
              />
            </label>

            <label>
              Reason
              <input
                value={adjustmentForm.reason}
                onChange={(event) => setAdjustmentForm({ ...adjustmentForm, reason: event.target.value })}
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={adjustmentForm.date}
                onChange={(event) => setAdjustmentForm({ ...adjustmentForm, date: event.target.value })}
              />
            </label>

            <button type="submit">
              {editingIndex !== null ? 'Update Adjustment' : 'Save Adjustment'}
            </button>
          </form>
        )}

        <StockTable
          title="All stock adjustments"
          columns={['Product', 'Location', 'Type', 'Quantity', 'Reason', 'Date', 'Action']}
          rows={visibleAdjustments}
          query={query}
          setQuery={setQuery}
          onEdit={editAdjustment}
          onDelete={deleteAdjustment}
        />
      </div>
    )
  }

  if (isTransferPage) {
    return (
      <div className="content-panel users-page">
        <div className="users-title">
          <div>
            <h3>{activePage === 'Add Stock Transfer' ? 'Add Stock Transfer' : 'Stock Transfers'}</h3>
            <span>Move stock between stores, warehouse, and counters</span>
          </div>

          <button onClick={showForm ? resetTransferForm : openTransferForm}>
            {showForm ? 'Close' : '+ Add Transfer'}
          </button>
        </div>

        {showForm && (
          <form className="user-form" onSubmit={saveTransfer}>
            <label>
              From Location
              <input
                value={transferForm.fromLocation}
                onChange={(event) => setTransferForm({ ...transferForm, fromLocation: event.target.value })}
                required
              />
            </label>

            <label>
              To Location
              <input
                value={transferForm.toLocation}
                onChange={(event) => setTransferForm({ ...transferForm, toLocation: event.target.value })}
                required
              />
            </label>

            <label>
              Product
              <input
                value={transferForm.product}
                onChange={(event) => setTransferForm({ ...transferForm, product: event.target.value })}
                required
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                value={transferForm.quantity}
                onChange={(event) => setTransferForm({ ...transferForm, quantity: event.target.value })}
                required
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={transferForm.date}
                onChange={(event) => setTransferForm({ ...transferForm, date: event.target.value })}
              />
            </label>

            <label>
              Status
              <select
                value={transferForm.status}
                onChange={(event) => setTransferForm({ ...transferForm, status: event.target.value })}
              >
                <option>Pending</option>
                <option>In Transit</option>
                <option>Completed</option>
              </select>
            </label>

            <button type="submit">
              {editingIndex !== null ? 'Update Transfer' : 'Save Transfer'}
            </button>
          </form>
        )}

        <StockTable
          title="All stock transfers"
          columns={['From', 'To', 'Product', 'Quantity', 'Date', 'Status', 'Action']}
          rows={visibleTransfers}
          query={query}
          setQuery={setQuery}
          onEdit={editTransfer}
          onDelete={deleteTransfer}
        />
      </div>
    )
  }

  return null
}

function StockTable({ title, columns, rows, query, setQuery, onEdit, onDelete }) {
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