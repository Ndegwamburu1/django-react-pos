import { useEffect, useMemo, useState } from 'react'

const emptyProductForm = {
  name: '',
  barcode: '',
  category: '',
  price: '',
  stock: '',
}

const productTools = {
  Variations: {
    title: 'Variations',
    fields: ['Name', 'Product', 'Value'],
    rows: [
      ['Small', 'Beef', '500g'],
      ['Large', 'Chicken', '1kg'],
    ],
  },
  Units: {
    title: 'Units',
    fields: ['Name', 'Short Name', 'Allow Decimal'],
    rows: [
      ['Pieces', 'pcs', 'No'],
      ['Kilogram', 'kg', 'Yes'],
    ],
  },
  Categories: {
    title: 'Categories',
    fields: ['Name', 'Code', 'Description'],
    rows: [
      ['Meat', 'MEAT', 'Butchery products'],
      ['Grocery', 'GROC', 'General products'],
    ],
  },
  Brands: {
    title: 'Brands',
    fields: ['Name', 'Description'],
    rows: [
      ['Techaiot', 'Default business brand'],
    ],
  },
  Warranties: {
    title: 'Warranties',
    fields: ['Name', 'Duration', 'Description'],
    rows: [
      ['No Warranty', '0 days', 'Default warranty'],
    ],
  },
}

function money(value) {
  return `KES ${Number(value || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function LocalToolPage({ config, setStatus }) {
  const [rows, setRows] = useState(config.rows)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [form, setForm] = useState(() => config.fields.map(() => ''))

  const visibleRows = rows.filter((row) =>
    row.join(' ').toLowerCase().includes(query.toLowerCase()),
  )

  function resetForm() {
    setForm(config.fields.map(() => ''))
    setEditingIndex(null)
    setShowForm(false)
  }

  function saveRow(event) {
    event.preventDefault()

    if (!form[0].trim()) {
      setStatus(`${config.title} name is required.`)
      return
    }

const cleanForm = form.map((value) => value.trim())

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

    setRows((currentRows) => [...currentRows, form])
    setStatus(`${config.title} added.`)
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
          <span>Manage {config.title.toLowerCase()}</span>
        </div>

        <button onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? 'Close' : `+ Add ${config.title}`}
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
  No {config.title.toLowerCase()} found. Click + Add {config.title} to create one.
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

function PrintLabels({ products, setStatus }) {
  const [selectedProducts, setSelectedProducts] = useState({})

  function toggleProduct(product) {
    setSelectedProducts((current) => ({
      ...current,
      [product.id]: current[product.id] ? undefined : 1,
    }))
  }

  function updateQuantity(productId, quantity) {
    setSelectedProducts((current) => ({
      ...current,
      [productId]: Number(quantity || 1),
    }))
  }

  function printLabels() {
    const selectedCount = Object.values(selectedProducts).filter(Boolean).length

    if (!selectedCount) {
      setStatus('Select at least one product before printing labels.')
      return
    }

    setStatus(`${selectedCount} product label(s) ready for printing.`)
    window.print()
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Print Labels</h3>
          <span>Select products and print barcode labels</span>
        </div>

        <button onClick={printLabels}>Print Labels</button>
      </div>

      <div className="product-table">
        <div className="product-row table-head">
          <span>Item</span>
          <span>Barcode</span>
          <span>Stock</span>
          <span>Quantity</span>
          <span>Select</span>
        </div>

        {products.map((product) => (
          <div className="product-row" key={product.id}>
            <div>
              <strong>{product.name}</strong>
              <small>{product.category_name || product.category || 'General'}</small>
            </div>

            <span>{product.barcode || 'No barcode'}</span>
            <span>{product.stock}</span>

            <input
              type="number"
              min="1"
              value={selectedProducts[product.id] || 1}
              onChange={(event) => updateQuantity(product.id, event.target.value)}
            />

            <input
              type="checkbox"
              checked={Boolean(selectedProducts[product.id])}
              onChange={() => toggleProduct(product)}
            />
          </div>
        ))}
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}

export default function Products({
  activePage,
  products,
  setProducts,
  setStatus,
  createProduct,
  updateProduct,
  deleteProduct,
}) {
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productForm, setProductForm] = useState(emptyProductForm)

  useEffect(() => {
    if (activePage === 'Add Product') {
      setShowForm(true)
      setEditingProductId(null)
      setProductForm(emptyProductForm)
    }
  }, [activePage])

  const visibleProducts = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) return products

    return products.filter((product) =>
      `${product.name} ${product.barcode || ''} ${product.category || product.category_name || ''}`
        .toLowerCase()
        .includes(search),
    )
  }, [products, query])

  function resetForm() {
    setProductForm(emptyProductForm)
    setEditingProductId(null)
    setShowForm(false)
  }

  function openCreateForm() {
    setProductForm(emptyProductForm)
    setEditingProductId(null)
    setShowForm(true)
    setStatus('Product form opened.')
  }

  function editProduct(product) {
    setProductForm({
      name: product.name || '',
      barcode: product.barcode || '',
      category: product.category || product.category_name || '',
      price: product.price || '',
      stock: product.stock || '',
    })
    setEditingProductId(product.id)
    setShowForm(true)
    setStatus(`${product.name} loaded for editing.`)
  }

  function saveProduct(event) {
    event.preventDefault()

    if (!productForm.name.trim()) {
      setStatus('Product name is required.')
      return
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price || 0),
      stock: Number(productForm.stock || 0),
    }

    if (editingProductId) {
      updateProduct(editingProductId, payload)
        .then((updatedProduct) => {
          setProducts((currentProducts) =>
            currentProducts.map((product) =>
              product.id === editingProductId ? updatedProduct : product,
            ),
          )
          resetForm()
          setStatus('Product updated in database.')
        })
        .catch(() => setStatus('Product could not be updated. Check Django API.'))

      return
    }

    createProduct(payload)
      .then((createdProduct) => {
        setProducts((currentProducts) => [...currentProducts, createdProduct])
        resetForm()
        setStatus('Product saved to database.')
      })
      .catch(() => setStatus('Product could not be saved. Check Django API.'))
  }

  function removeProduct(product) {
    deleteProduct(product.id)
      .then(() => {
        setProducts((currentProducts) =>
          currentProducts.filter((item) => item.id !== product.id),
        )
        setStatus(`${product.name} deleted from database.`)
      })
      .catch(() => setStatus('Product could not be deleted. Check Django API.'))
  }

  if (activePage === 'Print Labels') {
    return <PrintLabels products={products} setStatus={setStatus} />
  }

  if (productTools[activePage]) {
    return <LocalToolPage config={productTools[activePage]} setStatus={setStatus} />
  }

  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>{activePage === 'Add Product' ? 'Add Product' : 'Products'}</h3>
          <span>Manage products</span>
        </div>

        <button onClick={showForm ? resetForm : openCreateForm}>
          {showForm ? 'Close' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form className="user-form" onSubmit={saveProduct}>
          <label>
            Product name
            <input
              value={productForm.name}
              onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
              required
            />
          </label>

          <label>
            Barcode
            <input
              value={productForm.barcode}
              onChange={(event) => setProductForm({ ...productForm, barcode: event.target.value })}
            />
          </label>

          <label>
            Category
            <input
              value={productForm.category}
              onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
            />
          </label>

          <label>
            Price
            <input
              type="number"
              value={productForm.price}
              onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
              required
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              value={productForm.stock}
              onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
              required
            />
          </label>

          <button type="submit">
            {editingProductId ? 'Update Product' : 'Save Product'}
          </button>
        </form>
      )}

      <div className="users-card">
        <div className="users-card-header">
          <strong>All products</strong>
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

        <div className="product-table">
          <div className="product-row table-head">
            <span>Item</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Price</span>
            <span>Actions</span>
          </div>

          {visibleProducts.map((product) => (
            <div className="product-row" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <small>{product.barcode || 'No barcode'}</small>
              </div>

              <span>{product.category_name || product.category || 'General'}</span>

              <span className={Number(product.stock) <= 10 ? 'stock low' : 'stock'}>
                {product.stock}
              </span>

              <strong>{money(product.price)}</strong>

              <span className="users-actions">
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => removeProduct(product)}>Delete</button>
              </span>
            </div>
          ))}

          {visibleProducts.length === 0 && (
            <div className="home-empty-row">No data available in table</div>
          )}
        </div>

        <div className="users-footer">
          <span>
            Showing {visibleProducts.length ? 1 : 0} to {visibleProducts.length} of {visibleProducts.length} entries
          </span>

          <div className="users-pagination">
            <button disabled={visibleProducts.length === 0}>Previous</button>
            {visibleProducts.length > 0 && <button className="active">1</button>}
            <button disabled={visibleProducts.length === 0}>Next</button>
          </div>
        </div>
      </div>

      <footer className="users-copyright">
        Techaiot POS - V6.11 | Copyright (c) 2026 All rights reserved.
      </footer>
    </div>
  )
}