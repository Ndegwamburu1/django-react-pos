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

export default function Sidebar({
  activePage,
  setActivePage,
  openMenus,
  setOpenMenus,
  setStatus,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">TA</div>
        <div>
          <span>Business</span>
          <h1>Techaiot POS</h1>
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
  )
}