import { useMemo, useState } from 'react'

const emptyPurchaseForm = {
  supplier: '',
  reference: '',
  date: '',
  status: 'Received',
  total: '',
  paymentStatus: 'Paid',
}

const emptyReturnForm = {
  supplier: '',
  reference: '',
  date: '',
  amount: '',
  reason: '',
}

const startingPurchases = [
  ['john meat suppliers', 'PO2026/0001', '2026-06-07', 'Received', 'KES 21,460.00', 'Due'],
]

const startingReturns = [
  ['No purchase returns yet', '-', '-', 'KES 0.00', '-'],
]

function normaliseMoney(value) {
  const amount = Number(value || 0)

  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function Purchases({ activePage, setStatus }) {
  const [purchases, setPurchases] = useState(startingPurchases)
  const [returns, setReturns] = useState(startingReturns)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(activePage === 'Add Purchase')
  const [editingIndex, setEditingIndex] = useState(null)
  const [purchaseForm, setPurchaseForm] = useState(emptyPurchaseForm)
  const [returnForm, setReturnForm] = useState(emptyReturnForm)

  const isReturnPage = activePage === 'List Purchase Return'

  const visiblePurchases = useMemo(() => {
    return purchases.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [purchases, query])

  const visibleReturns = useMemo(() => {
    return returns.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [returns, query])

  function resetPurchaseForm() {
    setPurchaseForm(emptyPurchaseForm)
    setEditingIndex(null)
    setShowForm(false)
  }

  function resetReturnForm() {
    setReturnForm(emptyReturnForm)
    setEditingIndex(null)
    setShowForm(false)
  }

  function openPurchaseForm() {
    setPurchaseForm(emptyPurchaseForm)
    setEditingIndex(null)
    setShowForm(true)
    setStatus('Purchase form opened.')
  }

  function openReturnForm() {
    setReturnForm(emptyReturnForm)
    setEditingIndex(null)
    setShowForm(true)
    setStatus('Purchase return form opened.')
  }

  function savePurchase(event) {
    event.preventDefault()

    if (!purchaseForm.supplier.trim()) {
      setStatus('Supplier is required.')
      return
    }

    const row = [
      purchaseForm.supplier.trim(),
      purchaseForm.reference.trim() || `PO${Date.now().toString().slice(-6)}`,
      purchaseForm.date || new Date().toISOString().slice(0, 10),
      purchaseForm.status,
      normaliseMoney(purchaseForm.total),
      purchaseForm.paymentStatus,
    ]

    if (editingIndex !== null) {
      setPurchases((currentRows) =>
        currentRows.map((purchase, index) => (index === editingIndex ? row : purchase)),
      )
      setQuery('')
      setStatus('Purchase updated and visible in the table.')
      resetPurchaseForm()
      return
    }

    setPurchases((currentRows) => [...currentRows, row])
    setQuery('')
    setStatus('Purchase added and visible in the table.')
    resetPurchaseForm()
  }

  function saveReturn(event) {
    event.preventDefault()

    if (!returnForm.supplier.trim()) {
      setStatus('Supplier is required.')
      return
    }

    const row = [
      returnForm.supplier.trim(),
      returnForm.reference.trim() || `RET${Date.now().toString().slice(-6)}`,
      returnForm.date || new Date().toISOString().slice(0, 10),
      normaliseMoney(returnForm.amount),
      returnForm.reason.trim() || '-',
    ]

    if (editingIndex !== null) {
      setReturns((currentRows) =>
        currentRows.map((purchaseReturn, index) => (index === editingIndex ? row : purchaseReturn)),
      )
      setQuery('')
      setStatus('Purchase return updated and visible in the table.')
      resetReturnForm()
      return
    }

    setReturns((currentRows) => [...currentRows, row])
    setQuery('')
    setStatus('Purchase return added and visible in the table.')
    resetReturnForm()
  }

  function editPurchase(row, index) {
    setPurchaseForm({
      supplier: row[0],
      reference: row[1],
      date: row[2],
      status: row[3],
      total: row[4].replace(/[^\d.]/g, ''),
      paymentStatus: row[5],
    })
    setEditingIndex(index)
    setShowForm(true)
    setStatus('Purchase loaded for editing.')
  }

  function editReturn(row, index) {
    setReturnForm({
      supplier: row[0],
      reference: row[1],
      date: row[2],
      amount: row[3].replace(/[^\d.]/g, ''),
      reason: row[4],
    })
    setEditingIndex(index)
    setShowForm(true)
    setStatus('Purchase return loaded for editing.')
  }

  function deletePurchase(index) {
    setPurchases((currentRows) => currentRows.filter((purchase, rowIndex) => rowIndex !== index))
    setStatus('Purchase deleted.')
  }

  function deleteReturn(index) {
    setReturns((currentRows) => currentRows.filter((purchaseReturn, rowIndex) => rowIndex !== index))
    setStatus('Purchase return deleted.')
  }

  if (isReturnPage) {
    return (
      <div className="content-panel users-page">
        <div className="users-title">
          <div>
            <h3>Purchase Returns</h3>
            <span>Manage returned purchases</span>
          </div>

          <button onClick={showForm ? resetReturnForm : openReturnForm}>
            {showForm ? 'Close' : '+ Add Return'}
          </button>
        </div>

        {showForm && (
          <form className="user-form" onSubmit={saveReturn}>
            <label>
              Supplier
              <input
                value={returnForm.supplier}
                onChange={(event) => setReturnForm({ ...returnForm, supplier: event.target.value })}
                required
              />
            </label>

            <label>
              Reference
              <input
                value={returnForm.reference}
                onChange={(event) => setReturnForm({ ...returnForm, reference: event.target.value })}
              />
            </label>

            <label>
              Date
              <input
                type="date"
                value={returnForm.date}
                onChange={(event) => setReturnForm({ ...returnForm, date: event.target.value })}
              />
            </label>

            <label>
              Amount
              <input
                type="number"
                value={returnForm.amount}
                onChange={(event) => setReturnForm({ ...returnForm, amount: event.target.value })}
                required
              />
            </label>

            <label>
              Reason
              <input
                value={returnForm.reason}
                onChange={(event) => setReturnForm({ ...returnForm, reason: event.target.value })}
              />
            </label>

            <button type="submit">
              {editingIndex !== null ? 'Update Return' : 'Save Return'}
            </button>
          </form>
        )}

        <PurchaseTable
          title="All purchase returns"
          columns={['Supplier', 'Reference', 'Date', 'Amount', 'Reason', 'Action']}
          rows={visibleReturns}
          query={query}
          setQuery={setQuery}
          onEdit={editReturn}
          onDelete={deleteReturn}
        />
      </div>
    )
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>{activePage === 'Add Purchase' ? 'Add Purchase' : 'Purchases'}</h3>
          <span>Manage purchases and supplier bills</span>
        </div>

        <button onClick={showForm ? resetPurchaseForm : openPurchaseForm}>
          {showForm ? 'Close' : '+ Add Purchase'}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={savePurchase}>
          <label>
            Supplier
            <input
              value={purchaseForm.supplier}
              onChange={(event) => setPurchaseForm({ ...purchaseForm, supplier: event.target.value })}
              required
            />
          </label>

          <label>
            Reference
            <input
              value={purchaseForm.reference}
              onChange={(event) => setPurchaseForm({ ...purchaseForm, reference: event.target.value })}
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={purchaseForm.date}
              onChange={(event) => setPurchaseForm({ ...purchaseForm, date: event.target.value })}
            />
          </label>

          <label>
            Status
            <select
              value={purchaseForm.status}
              onChange={(event) => setPurchaseForm({ ...purchaseForm, status: event.target.value })}
            >
              <option>Received</option>
              <option>Pending</option>
              <option>Ordered</option>
            </select>
          </label>

          <label>
            Total
            <input
              type="number"
              value={purchaseForm.total}
              onChange={(event) => setPurchaseForm({ ...purchaseForm, total: event.target.value })}
              required
            />
          </label>

          <label>
            Payment Status
            <select
              value={purchaseForm.paymentStatus}
              onChange={(event) => setPurchaseForm({ ...purchaseForm, paymentStatus: event.target.value })}
            >
              <option>Paid</option>
              <option>Due</option>
              <option>Partial</option>
            </select>
          </label>

          <button type="submit">
            {editingIndex !== null ? 'Update Purchase' : 'Save Purchase'}
          </button>
        </form>
      )}

      <PurchaseTable
        title="All purchases"
        columns={['Supplier', 'Reference', 'Date', 'Status', 'Total', 'Payment', 'Action']}
        rows={visiblePurchases}
        query={query}
        setQuery={setQuery}
        onEdit={editPurchase}
        onDelete={deletePurchase}
      />
    </div>
  )
}

function PurchaseTable({ title, columns, rows, query, setQuery, onEdit, onDelete }) {
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