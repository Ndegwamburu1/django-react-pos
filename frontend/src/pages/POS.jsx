import { useMemo } from 'react'

const quickActions = ['New Sale', 'Hold Bill', 'Return', 'Cash Drawer', 'Receipt', 'End Shift']

function money(value) {
  return `KES ${Number(value || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function POS({
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