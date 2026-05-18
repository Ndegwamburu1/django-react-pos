import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/api/products/'

const demoProducts = [
  { id: 'demo-1', name: 'White Bread 600g', barcode: '10001', category: 'Bakery', price: '85.00', stock: 42 },
  { id: 'demo-2', name: 'Fresh Milk 500ml', barcode: '10002', category: 'Dairy', price: '65.00', stock: 18 },
  { id: 'demo-3', name: 'Cooking Oil 1L', barcode: '10003', category: 'Grocery', price: '315.00', stock: 9 },
  { id: 'demo-4', name: 'Rice Pishori 2kg', barcode: '10004', category: 'Grocery', price: '420.00', stock: 23 },
  { id: 'demo-5', name: 'Airtime Voucher', barcode: '10005', category: 'Services', price: '100.00', stock: 100 },
  { id: 'demo-6', name: 'Tomato Sauce 700g', barcode: '10006', category: 'Grocery', price: '180.00', stock: 14 },
]

const navItems = [
  { label: 'Home', children: [] },
  { label: 'User Management', children: ['Users', 'Roles', 'Sales Commission Agents'] },
  { label: 'Contacts', children: ['Suppliers', 'Customers', 'Customer Groups', 'Import Contacts'] },
  {
    label: 'Products',
    children: ['List Products', 'Add Product', 'Print Labels', 'Variations', 'Units', 'Categories', 'Brands', 'Warranties'],
  },
  { label: 'Purchases', children: ['List Purchases', 'Add Purchase', 'List Purchase Return'] },
  {
    label: 'Sell',
    children: ['All Sales', 'Add Sale', 'POS', 'List Drafts', 'List Quotations', 'Sell Return', 'Shipments', 'Discounts', 'Subscriptions'],
  },
  { label: 'Stock Transfers', children: ['List Stock Transfers', 'Add Stock Transfer'] },
  { label: 'Stock Adjustment', children: ['List Stock Adjustments', 'Add Stock Adjustment'] },
  { label: 'Expenses', children: ['List Expenses', 'Add Expense', 'Expense Categories'] },
  {
    label: 'Reports',
    children: ['Profit / Loss Report', 'Product Stock Report', 'Sales Report', 'Purchase Report', 'Customer / Supplier Report', 'Tax Report', 'Trending Products'],
  },
  { label: 'Notification Templates', children: ['New Sale', 'Payment Received', 'Payment Reminder'] },
  {
    label: 'Settings',
    children: ['Business Settings', 'Business Locations', 'Invoice Settings', 'Barcode Settings', 'Receipt Printers', 'Tax Rates'],
  },
]

const quickActions = ['New Sale', 'Hold Bill', 'Return', 'Cash Drawer', 'Receipt', 'End Shift']
const payments = ['M-Pesa', 'Cash', 'Card', 'Credit']

function money(value) {
  return `KES ${Number(value || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function DataPage({ section, title, subtitle, tabLabel, actionLabel, columns, rows, setStatus }) {
  return (
    <div className="content-panel">
      <div className="page-title">
        <div>
          <h3>{title}</h3>
          {subtitle && <span>{subtitle}</span>}
        </div>

        {actionLabel && (
          <button onClick={() => setStatus(`${actionLabel} clicked.`)}>
            {actionLabel}
          </button>
        )}
      </div>

      <div className="list-card">
        <div className="list-card-title">
          <strong>{tabLabel || `All ${section}`}</strong>
        </div>

        <div className="table-toolbar">
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

          <input placeholder="Search ..." />
        </div>

        <div className="data-table">
          <div
            className="table-row header"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}
          >
            {columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          {rows.map((row) => (
            <div
              className="table-row"
              key={row.join('-')}
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}
            >
              {row.map((cell, index) => (
                <span key={`${cell}-${index}`}>{cell}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="table-footer">
          <span>Showing 1 to {rows.length} of {rows.length} entries</span>

          <div className="pagination">
            <button>Previous</button>
            <button className="active">1</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        Utmost Pos - V6.11 | Copyright © 2026 All rights reserved.
      </footer>
    </div>
  )
}

function ContentPanel({
  activePage,
  products,
  search,
  setSearch,
  addToCart,
  setStatus,
}) {
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) =>
      `${product.name} ${product.barcode || ''} ${product.category || product.category_name || ''}`
        .toLowerCase()
        .includes(query),
    )
  }, [products, search])

  const lowStock = products.filter((product) => Number(product.stock) <= 10).length
  if (activePage === 'Users') {
  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Users</h3>
          <span>Manage users</span>
        </div>

        <button onClick={() => setStatus('Add user clicked.')}>
          + Add
        </button>
      </div>

      <div className="users-card">
        <div className="users-card-header">
          <strong>All users</strong>
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

          <input placeholder="Search ..." />
        </div>

        <div className="users-table">
          <div className="users-row users-header">
            <span>Username</span>
            <span>Name</span>
            <span>Role</span>
            <span>Email</span>
            <span>Action</span>
          </div>

          <div className="users-row">
            <span>admin001</span>
            <span>001</span>
            <span>Admin</span>
            <span>001@gmail.com</span>
            <span className="users-actions">Edit | Delete</span>
          </div>

          <div className="users-row">
            <span>Moses</span>
            <span>mr Moses Kariuki</span>
            <span>Admin</span>
            <span>moseskaris002@gmail.com</span>
            <span className="users-actions">Edit | Delete</span>
          </div>
        </div>

        <div className="users-footer">
          <span>Showing 1 to 2 of 2 entries</span>

          <div className="users-pagination">
            <button>Previous</button>
            <button className="active">1</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      <footer className="users-copyright">
        Utmost Pos - V6.11 | Copyright © 2026 All rights reserved.
      </footer>
    </div>
  )
}
if (activePage === 'Roles') {
  return (
    <div className="content-panel users-page">
      <div className="users-title">
        <div>
          <h3>Roles</h3>
          <span>Manage roles</span>
        </div>

        <button onClick={() => setStatus('Add role clicked.')}>
          + Add
        </button>
      </div>

      <div className="users-card">
        <div className="users-card-header">
          <strong>All roles</strong>
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

          <input placeholder="Search ..." />
        </div>

        <div className="users-table">
          <div className="roles-row users-header">
            <span>Roles</span>
            <span>Action</span>
          </div>

          <div className="roles-row">
            <span>Admin</span>
            <span className="users-actions">Edit | Delete</span>
          </div>
        </div>

        <div className="users-footer">
          <span>Showing 1 to 1 of 1 entries</span>

          <div className="users-pagination">
            <button>Previous</button>
            <button className="active">1</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      <footer className="users-copyright">
        Utmost Pos - V6.11 | Copyright © 2026 All rights reserved.
      </footer>
    </div>
  )
}

  if (activePage === 'Home') {
    return (
      <div className="content-panel">
        <div className="panel-head">
          <div>
            <span>Dashboard</span>
            <h3>Home</h3>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span>Today's Sales</span>
            <strong>{money(48250)}</strong>
            <small>Counter revenue</small>
          </div>
          <div className="stat-card">
            <span>Total Orders</span>
            <strong>87</strong>
            <small>Sales activity</small>
          </div>
          <div className="stat-card">
            <span>Low Stock Items</span>
            <strong>{lowStock}</strong>
            <small>Needs attention</small>
          </div>
          <div className="stat-card">
            <span>Cash Balance</span>
            <strong>{money(16300)}</strong>
            <small>Current drawer</small>
          </div>
        </div>
      </div>
    )
  }

  if (activePage === 'POS') {
    return (
      <div className="sell-panel">
        <div className="panel-head">
          <div>
            <span>Point of Sale</span>
            <h3>POS</h3>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search or scan barcode"
          />
        </div>

        <div className="quick-actions">
          {quickActions.map((action) => (
            <button key={action} onClick={() => setStatus(`${action} clicked.`)}>
              {action}
            </button>
          ))}
        </div>

        <div className="product-table">
          <div className="product-row table-head">
            <span>Item</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Price</span>
            <span></span>
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
              <button onClick={() => addToCart(product)}>Add</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activePage === 'List Products') {
    return (
      <div className="content-panel">
        <div className="panel-head">
          <div>
            <span>Products</span>
            <h3>List Products</h3>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
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
              <button onClick={() => setStatus(`Edit ${product.name}`)}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activePage.startsWith('Add ')) {
    return (
      <FormPage
        section="Create Record"
        title={activePage}
        fields={['Name', 'Reference', 'Amount', 'Date']}
        setStatus={setStatus}
      />
    )
  }

  const pageRows = {
    Users: {
  section: 'Users',
  subtitle: 'Manage users',
  tab: 'All users',
  action: '+ Add',
  columns: ['Username', 'Name', 'Role', 'Email', 'Action'],
  rows: [
    ['admin001', '001', 'Admin', '001@gmail.com', 'Edit | Delete'],
    ['Moses', 'mr Moses Kariuki', 'Admin', 'moseskaris002@gmail.com', 'Edit | Delete'],
  ],
},
    Roles: [
      { name: 'Admin', details: 'Full system access', status: 'Active' },
      { name: 'Cashier', details: 'POS and sales access', status: 'Active' },
      { name: 'Manager', details: 'Reports and management', status: 'Active' },
    ],
    Suppliers: [
      { name: 'Bakery Supplies Ltd', details: 'Nairobi supplier', status: 'Active' },
      { name: 'Fresh Dairy Co', details: 'Dairy supplier', status: 'Active' },
    ],
    Customers: [
      { name: 'Walk-in Customer', details: 'Default customer', status: 'Active' },
      { name: 'Jane Smith', details: 'Credit customer', status: 'Active' },
    ],
  }

  return (
    <DataPage
      section="I Plus Butchery"
      title={activePage}
      actionLabel={`+ Add ${activePage.replace('List ', '')}`}
      rows={pageRows[activePage] || [
        { name: activePage, details: 'This page is ready for backend data.', status: 'Draft' },
        { name: 'Sample Record', details: 'Placeholder while building the POS.', status: 'Active' },
      ]}
      setStatus={setStatus}
    />
  )
}

export default function App() {
  const [products, setProducts] = useState(demoProducts)
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [activePage, setActivePage] = useState('POS')
  const [payment, setPayment] = useState('M-Pesa')
  const [status, setStatus] = useState('Demo mode active. Start Django for live products.')
  const [lastReceipt, setLastReceipt] = useState(null)
  const [openMenus, setOpenMenus] = useState({
    Sell: true,
  })
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Products unavailable')
        return response.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
          setStatus('Live products loaded from Django.')
        }
      })
      .catch(() => {
        setStatus('Demo mode active. Start Django with python manage.py runserver for live products.')
      })
  }, [])
  useEffect(() => {
  function handleScroll() {
    setIsScrolled(window.scrollY > 20)
  }

  window.addEventListener('scroll', handleScroll)
  handleScroll()

  return () => window.removeEventListener('scroll', handleScroll)
}, [])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart],
  )

  const vat = subtotal * 0.16
  const discount = subtotal >= 1000 ? subtotal * 0.03 : 0
  const total = subtotal + vat - discount
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const lowStock = products.filter((product) => Number(product.stock) <= 10).length

  function addToCart(product) {
    setStatus(`${product.name} added to bill.`)
    setLastReceipt(null)

    setCart((items) => {
      const existing = items.find((item) => item.id === product.id)

      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...items, { ...product, quantity: 1 }]
    })
  }

  function updateQuantity(id, amount) {
    setCart((items) =>
      items
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
        .filter((item) => item.quantity > 0),
    )
    setStatus('Bill updated.')
  }

  function completeSale() {
    if (!cart.length) {
      setStatus('Add products before completing a sale.')
      return
    }

    const receipt = `IPB-${Date.now().toString().slice(-6)}`
    setLastReceipt({ receipt, amount: total, payment })
    setCart([])
    setStatus(`Sale completed successfully. Receipt ${receipt}`)
  }

  return (
    
      <div className={isScrolled ? 'pos-shell scrolled' : 'pos-shell'}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">IP</div>
          <div>
            <span>Business</span>
            <h1>I Plus Butchery</h1>
          </div>
        </div>

        <nav>
          {navItems.map((item) => {
            const isOpen = openMenus[item.label]
            const hasChildren = item.children.length > 0
            const hasActiveChild = item.children.includes(activePage)
            const isActive = activePage === item.label || hasActiveChild

            return (
              <div className="nav-group" key={item.label}>
                <button
                  className={isActive ? 'nav-item active' : 'nav-item'}
                  onClick={() => {
                    if (hasChildren) {
                      setOpenMenus((menus) => ({
                        ...menus,
                        [item.label]: !menus[item.label],
                      }))
                    } else {
                      setActivePage(item.label)
                      setStatus(`${item.label} selected.`)
                    }
                  }}
                >
                  <span>{item.label.slice(0, 2)}</span>
                  <strong>{item.label}</strong>
                  {hasChildren && <em className="chevron">{isOpen ? '-' : '+'}</em>}
                </button>

                {hasChildren && isOpen && (
                  <div className="nav-submenu">
                    {item.children.map((child) => (
                      <button
                        className={activePage === child ? 'nav-subitem active' : 'nav-subitem'}
                        key={child}
                        onClick={() => {
                          setActivePage(child)
                          setStatus(`${child} selected.`)
                        }}
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="shift-card">
          <span>Current Shift</span>
          <strong>Counter 01 Open</strong>
          <small>Cashier: Admin User</small>
        </div>
      </aside>

      <main className="main">
        {activePage === 'POS' && (
  <header className="hero">
    <div>
      <span>Fast checkout and inventory control</span>
      <h2>Sell, track stock, manage payments, and close shifts from one beautiful counter.</h2>
    </div>
    <button onClick={() => setStatus('Ready for a new sale.')}>Start Sale</button>
  </header>
)}

        {activePage === 'POS' && (
  <section className="stats">
    <article>
      <span>Today Sales</span>
      <strong>{money(subtotal || 48250)}</strong>
      <small>Counter revenue</small>
    </article>
    <article>
      <span>Transactions</span>
      <strong>{itemsCount || 87}</strong>
      <small>Items / sales activity</small>
    </article>
    <article>
      <span>Low Stock</span>
      <strong>{lowStock}</strong>
      <small>Needs reorder</small>
    </article>
    <article>
      <span>Cashbox</span>
      <strong>{money(16300)}</strong>
      <small>Expected drawer</small>
    </article>
  </section>
)}

        <p className="status">{status}</p>

        <section className={activePage === 'POS' ? 'workspace' : 'workspace single'}>
          <ContentPanel
            activePage={activePage}
            products={products}
            search={search}
            setSearch={setSearch}
            addToCart={addToCart}
            setStatus={setStatus}
          />

          {activePage === 'POS' && (
            <aside className="receipt">
              <div className="receipt-head">
                <div>
                  <span>Current Bill</span>
                  <h3>Receipt</h3>
                </div>
                <strong>{itemsCount} items</strong>
              </div>

              <div className="cart">
                {!cart.length && <p>No active sale. Add products to begin.</p>}

                {cart.map((item) => (
                  <div className="cart-line" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{money(item.price)} each</small>
                    </div>
                    <div className="qty">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="payments">
                {payments.map((method) => (
                  <button
                    className={payment === method ? 'selected' : ''}
                    key={method}
                    onClick={() => setPayment(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="totals">
                <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                <div><span>VAT 16%</span><strong>{money(vat)}</strong></div>
                <div><span>Discount</span><strong>- {money(discount)}</strong></div>
                <div className="grand"><span>Total</span><strong>{money(total)}</strong></div>
              </div>

              <button className="complete" disabled={!cart.length} onClick={completeSale}>
                Complete Sale
              </button>

              <button className="clear" onClick={() => { setCart([]); setStatus('Bill cleared.') }}>
                Clear Bill
              </button>

              {lastReceipt && (
                <div className="success">
                  <strong>{lastReceipt.receipt} completed</strong>
                  <span>{lastReceipt.payment}: {money(lastReceipt.amount)}</span>
                </div>
              )}
            </aside>
          )}
        </section>
      </main>
    </div>
  )
}