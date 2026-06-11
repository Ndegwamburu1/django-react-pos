import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Sidebar from './layout/Sidebar'
import Home from './pages/Home'
import Users from './pages/Users'
import { createUser, getUsers } from './api/users'
import Roles from './pages/Roles'
import POS from './pages/POS'
import Products from './pages/Products'
import Contacts from './pages/Contacts'
import Purchases from './pages/Purchases'
import Sell from './pages/Sell'
import Stock from './pages/Stock'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import NotificationTemplates from './pages/NotificationTemplates'
import Settings from './pages/Settings'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
}
 from './api/products'
const API_URL = 'http://127.0.0.1:8000/api/products/'

const demoProducts = [
  { id: 'demo-1', name: 'White Bread 600g', barcode: '10001', category: 'Bakery', price: '85.00', stock: 42 },
  { id: 'demo-2', name: 'Fresh Milk 500ml', barcode: '10002', category: 'Dairy', price: '65.00', stock: 18 },
  { id: 'demo-3', name: 'Cooking Oil 1L', barcode: '10003', category: 'Grocery', price: '315.00', stock: 9 },
  { id: 'demo-4', name: 'Rice Pishori 2kg', barcode: '10004', category: 'Grocery', price: '420.00', stock: 23 },
  { id: 'demo-5', name: 'Airtime Voucher', barcode: '10005', category: 'Services', price: '100.00', stock: 100 },
  { id: 'demo-6', name: 'Tomato Sauce 700g', barcode: '10006', category: 'Grocery', price: '180.00', stock: 14 },
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
        techaiot Pos - V6.11 | Copyright © 2026 All rights reserved.
      </footer>
    </div>
  )
}

const productPages = [
  'List Products',
  'Add Product',
  'Print Labels',
  'Variations',
  'Units',
  'Categories',
  'Brands',
  'Warranties',
]
const contactPages = [
  'Suppliers',
  'Customers',
  'Customer Groups',
  'Import Contacts',
]
const purchasePages = [
  'List Purchases',
  'Add Purchase',
  'List Purchase Return',
]
const sellPages = [
  'All Sales',
  'Add Sale',
  'List Drafts',
  'List Quotations',
  'Sell Return',
  'Shipments',
  'Discounts',
  'Subscriptions',
]
const stockPages = [
  'List Stock Transfers',
  'Add Stock Transfer',
  'List Stock Adjustments',
  'Add Stock Adjustment',
]
const expensePages = [
  'List Expenses',
  'Add Expense',
  'Expense Categories',
]
const reportPages = [
  'Profit / Loss Report',
  'Product Stock Report',
  'Sales Report',
  'Purchase Report',
  'Customer / Supplier Report',
  'Tax Report',
  'Trending Products',
]
const notificationPages = [
  'New Sale',
  'Payment Received',
  'Payment Reminder',
]
const settingPages = [
  'Business Settings',
  'Business Locations',
  'Invoice Settings',
  'Barcode Settings',
  'Receipt Printers',
  'Tax Rates',
]

function ContentPanel({
  activePage,
  products,
  setProducts,
  users,
  search,
  setSearch,
  addToCart,
  setStatus,
  setActivePage,
  homeDate,
  setHomeDate,
  showCalculator,
  setShowCalculator,
  showProfit,
  setShowProfit,
  showNotifications,
  setShowNotifications,
  showUserForm,
  setShowUserForm,
  userForm,
  setUserForm,
  saveUser,
  sidebarCollapsed,
  setSidebarCollapsed,
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

  if (activePage === 'Users') {
    return (
      <Users
        users={users}
        showUserForm={showUserForm}
        setShowUserForm={setShowUserForm}
        userForm={userForm}
        setUserForm={setUserForm}
        saveUser={saveUser}
      />
    )
  }

  if (activePage === 'Home') {
    return (
      <Home
        homeDate={homeDate}
        setHomeDate={setHomeDate}
        showCalculator={showCalculator}
        setShowCalculator={setShowCalculator}
        showProfit={showProfit}
        setShowProfit={setShowProfit}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        setActivePage={setActivePage}
        setStatus={setStatus}
      />
    )
  }

if (activePage === 'Roles') {
  return <Roles setStatus={setStatus} />
}
if (activePage === 'Sales Commission Agents') {
  return <SalesCommissionAgents setStatus={setStatus} />
}

  if (activePage === 'POS') {
  return (
    <POS
      products={products}
      search={search}
      setSearch={setSearch}
      addToCart={addToCart}
      setStatus={setStatus}
    />
  )
}
if (productPages.includes(activePage)) {
  return (
    <Products
      activePage={activePage}
      products={products}
      setProducts={setProducts}
      setStatus={setStatus}
      createProduct={createProduct}
      updateProduct={updateProduct}
      deleteProduct={deleteProduct}
    />
  )
}
if (contactPages.includes(activePage)) {
  return <Contacts activePage={activePage} setStatus={setStatus} />
}
if (purchasePages.includes(activePage)) {
  return <Purchases activePage={activePage} setStatus={setStatus} />
}
if (sellPages.includes(activePage)) {
  return (
    <Sell
      activePage={activePage}
      setStatus={setStatus}
      setActivePage={setActivePage}
    />
  )
}
if (stockPages.includes(activePage)) {
  return <Stock activePage={activePage} setStatus={setStatus} />
}
if (expensePages.includes(activePage)) {
  return <Expenses activePage={activePage} setStatus={setStatus} />
}
if (reportPages.includes(activePage)) {
  return <Reports activePage={activePage} setStatus={setStatus} />
}
if (notificationPages.includes(activePage)) {
  return <NotificationTemplates activePage={activePage} setStatus={setStatus} />
}
if (settingPages.includes(activePage)) {
  return <Settings activePage={activePage} setStatus={setStatus} />
}

  return (
    <DataPage
      section="Techaiot POS"
      title={activePage}
      subtitle="This page is ready for the next build step."
      tabLabel={`All ${activePage}`}
      actionLabel={`+ Add ${activePage.replace('List ', '')}`}
      columns={['Name', 'Details', 'Status', 'Action']}
      rows={[
        [activePage, 'This page is ready for backend data.', 'Draft', 'Open'],
        ['Sample Record', 'Placeholder while building the POS.', 'Active', 'Edit'],
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
  const [users, setUsers] = useState([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [homeDate, setHomeDate] = useState('2026-06-07')
  const [showCalculator, setShowCalculator] = useState(false)
  const [showProfit, setShowProfit] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState('light')
  const [userForm, setUserForm] = useState({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})
  const [openMenus, setOpenMenus] = useState({
    Sell: true,
  })
  const [isScrolled, setIsScrolled] = useState(false)

useEffect(() => {
  getProducts()
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
  getUsers()
    .then((data) => {
      setUsers(data)
    })
    .catch(() => {
      setStatus('Users could not be loaded from database.')
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
  function saveUser(event) {
  event.preventDefault()

  createUser(userForm)
    .then((createdUser) => {
      setUsers((currentUsers) => [...currentUsers, createdUser])
      setUserForm({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      })
      setShowUserForm(false)
      setStatus('User saved to database.')
    })
    .catch(() => {
      setStatus('User could not be saved. Check Django API.')
    })
}

  return (
    
<div className={`${isScrolled ? 'pos-shell scrolled' : 'pos-shell'} ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <Sidebar
  activePage={activePage}
  setActivePage={setActivePage}
  openMenus={openMenus}
  setOpenMenus={setOpenMenus}
  setStatus={setStatus}
/>


      <main className="main">
<div className="top-actions">
  <button
    className="theme-icon-button"
    title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    onClick={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
  >
    {theme === 'dark' ? '☀' : '☾'}
  </button>
</div>
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
  users={users}
  setUsers={setUsers}
  search={search}
  setSearch={setSearch}
  addToCart={addToCart}
  setStatus={setStatus}
  setActivePage={setActivePage}
  homeDate={homeDate}
  setHomeDate={setHomeDate}
  showCalculator={showCalculator}
  setShowCalculator={setShowCalculator}
  showProfit={showProfit}
  setShowProfit={setShowProfit}
  showNotifications={showNotifications}
  setShowNotifications={setShowNotifications}
  showUserForm={showUserForm}
  setShowUserForm={setShowUserForm}
  userForm={userForm}
  setUserForm={setUserForm}
  saveUser={saveUser}
  sidebarCollapsed={sidebarCollapsed}
  setSidebarCollapsed={setSidebarCollapsed}
  setProducts={setProducts}
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

