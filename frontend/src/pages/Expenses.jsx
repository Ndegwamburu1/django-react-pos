import { useMemo, useState } from 'react'

const emptyExpenseForm = {
  category: '',
  reference: '',
  amount: '',
  paymentMethod: 'Cash',
  date: '',
  note: '',
}

const emptyCategoryForm = {
  name: '',
  description: '',
}

const startingExpenses = [
  ['Utilities', 'EXP2026/0001', 'KES 5,000.00', 'Cash', '2026-06-10', 'Electricity bill'],
]

const startingCategories = [
  ['Utilities', 'Electricity, water, internet'],
  ['Transport', 'Delivery and logistics'],
  ['Rent', 'Shop rent and lease'],
]

function normaliseMoney(value) {
  const amount = Number(value || 0)

  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function Expenses({ activePage, setStatus }) {
  const [expenses, setExpenses] = useState(startingExpenses)
  const [categories, setCategories] = useState(startingCategories)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(activePage === 'Add Expense')
  const [editingIndex, setEditingIndex] = useState(null)
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm)
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm)

  const isCategoryPage = activePage === 'Expense Categories'

  const visibleExpenses = useMemo(() => {
    return expenses.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [expenses, query])

  const visibleCategories = useMemo(() => {
    return categories.filter((row) =>
      row.join(' ').toLowerCase().includes(query.toLowerCase()),
    )
  }, [categories, query])

  function resetExpenseForm() {
    setExpenseForm(emptyExpenseForm)
    setEditingIndex(null)
    setShowForm(false)
  }

  function resetCategoryForm() {
    setCategoryForm(emptyCategoryForm)
    setEditingIndex(null)
    setShowForm(false)
  }

  function openExpenseForm() {
    setExpenseForm(emptyExpenseForm)
    setEditingIndex(null)
    setShowForm(true)
    setStatus('Expense form opened.')
  }

  function openCategoryForm() {
    setCategoryForm(emptyCategoryForm)
    setEditingIndex(null)
    setShowForm(true)
    setStatus('Expense category form opened.')
  }

  function saveExpense(event) {
    event.preventDefault()

    if (!expenseForm.category.trim()) {
      setStatus('Expense category is required.')
      return
    }

    const row = [
      expenseForm.category.trim(),
      expenseForm.reference.trim() || `EXP${Date.now().toString().slice(-6)}`,
      normaliseMoney(expenseForm.amount),
      expenseForm.paymentMethod,
      expenseForm.date || new Date().toISOString().slice(0, 10),
      expenseForm.note.trim() || '-',
    ]

    if (editingIndex !== null) {
      setExpenses((currentRows) =>
        currentRows.map((expense, index) => (index === editingIndex ? row : expense)),
      )
      setQuery('')
      setStatus('Expense updated and visible in the table.')
      resetExpenseForm()
      return
    }

    setExpenses((currentRows) => [...currentRows, row])
    setQuery('')
    setStatus('Expense added and visible in the table.')
    resetExpenseForm()
  }

  function saveCategory(event) {
    event.preventDefault()

    if (!categoryForm.name.trim()) {
      setStatus('Expense category name is required.')
      return
    }

    const row = [
      categoryForm.name.trim(),
      categoryForm.description.trim() || '-',
    ]

    if (editingIndex !== null) {
      setCategories((currentRows) =>
        currentRows.map((category, index) => (index === editingIndex ? row : category)),
      )
      setQuery('')
      setStatus('Expense category updated and visible in the table.')
      resetCategoryForm()
      return
    }

    setCategories((currentRows) => [...currentRows, row])
    setQuery('')
    setStatus('Expense category added and visible in the table.')
    resetCategoryForm()
  }

  function editExpense(row, index) {
    setExpenseForm({
      category: row[0],
      reference: row[1],
      amount: row[2].replace(/[^\d.]/g, ''),
      paymentMethod: row[3],
      date: row[4],
      note: row[5],
    })
    setEditingIndex(index)
    setShowForm(true)
    setStatus('Expense loaded for editing.')
  }

  function editCategory(row, index) {
    setCategoryForm({
      name: row[0],
      description: row[1],
    })
    setEditingIndex(index)
    setShowForm(true)
    setStatus('Expense category loaded for editing.')
  }

  function deleteExpense(index) {
    setExpenses((currentRows) => currentRows.filter((expense, rowIndex) => rowIndex !== index))
    setStatus('Expense deleted.')
  }

  function deleteCategory(index) {
    setCategories((currentRows) => currentRows.filter((category, rowIndex) => rowIndex !== index))
    setStatus('Expense category deleted.')
  }

  if (isCategoryPage) {
    return (
      <div className="content-panel users-page">
        <div className="users-title">
          <div>
            <h3>Expense Categories</h3>
            <span>Manage expense types</span>
          </div>

          <button onClick={showForm ? resetCategoryForm : openCategoryForm}>
            {showForm ? 'Close' : '+ Add Category'}
          </button>
        </div>

        {showForm && (
          <form className="user-form" onSubmit={saveCategory}>
            <label>
              Category Name
              <input
                value={categoryForm.name}
                onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
                required
              />
            </label>

            <label>
              Description
              <input
                value={categoryForm.description}
                onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })}
              />
            </label>

            <button type="submit">
              {editingIndex !== null ? 'Update Category' : 'Save Category'}
            </button>
          </form>
        )}

        <ExpenseTable
          title="All expense categories"
          columns={['Category', 'Description', 'Action']}
          rows={visibleCategories}
          query={query}
          setQuery={setQuery}
          onEdit={editCategory}
          onDelete={deleteCategory}
        />
      </div>
    )
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>{activePage === 'Add Expense' ? 'Add Expense' : 'Expenses'}</h3>
          <span>Track operating expenses and payments</span>
        </div>

        <button onClick={showForm ? resetExpenseForm : openExpenseForm}>
          {showForm ? 'Close' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={saveExpense}>
          <label>
            Expense Category
            <input
              value={expenseForm.category}
              onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })}
              required
            />
          </label>

          <label>
            Reference
            <input
              value={expenseForm.reference}
              onChange={(event) => setExpenseForm({ ...expenseForm, reference: event.target.value })}
              placeholder="Auto if empty"
            />
          </label>

          <label>
            Amount
            <input
              type="number"
              value={expenseForm.amount}
              onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })}
              required
            />
          </label>

          <label>
            Payment Method
            <select
              value={expenseForm.paymentMethod}
              onChange={(event) => setExpenseForm({ ...expenseForm, paymentMethod: event.target.value })}
            >
              <option>Cash</option>
              <option>M-Pesa</option>
              <option>Card</option>
              <option>Bank Transfer</option>
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={expenseForm.date}
              onChange={(event) => setExpenseForm({ ...expenseForm, date: event.target.value })}
            />
          </label>

          <label>
            Note
            <input
              value={expenseForm.note}
              onChange={(event) => setExpenseForm({ ...expenseForm, note: event.target.value })}
            />
          </label>

          <button type="submit">
            {editingIndex !== null ? 'Update Expense' : 'Save Expense'}
          </button>
        </form>
      )}

      <ExpenseTable
        title="All expenses"
        columns={['Category', 'Reference', 'Amount', 'Payment', 'Date', 'Note', 'Action']}
        rows={visibleExpenses}
        query={query}
        setQuery={setQuery}
        onEdit={editExpense}
        onDelete={deleteExpense}
      />
    </div>
  )
}

function ExpenseTable({ title, columns, rows, query, setQuery, onEdit, onDelete }) {
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