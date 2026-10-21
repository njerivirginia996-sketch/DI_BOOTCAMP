import { useState } from 'react'
import { DataTable, type TableColumn } from './components/DataTable'
import './exercise.css'

type Product = { id: string; product: string; category: string; stock: number; price: number; status: 'In stock' | 'Low stock' }

const products: Product[] = [
  { id: 'P-104', product: 'Field Notes Set', category: 'Stationery', stock: 48, price: 18, status: 'In stock' },
  { id: 'P-208', product: 'Canvas Tote', category: 'Accessories', stock: 7, price: 32, status: 'Low stock' },
  { id: 'P-315', product: 'Desk Organizer', category: 'Workspace', stock: 23, price: 46, status: 'In stock' },
  { id: 'P-421', product: 'Ceramic Mug', category: 'Home', stock: 5, price: 24, status: 'Low stock' },
  { id: 'P-536', product: 'Linen Notebook', category: 'Stationery', stock: 62, price: 14, status: 'In stock' },
  { id: 'P-647', product: 'Brass Pen', category: 'Stationery', stock: 16, price: 28, status: 'In stock' },
]

const columns: TableColumn<Product>[] = [
  { key: 'id', title: 'SKU', sortable: true, render: (item) => <span className="sku-cell">{item.id}</span> },
  { key: 'product', title: 'Product', sortable: true, render: (item) => <strong className="product-cell">{item.product}</strong> },
  { key: 'category', title: 'Category', sortable: true },
  { key: 'stock', title: 'Stock', sortable: true, render: (item) => <span className={item.stock < 10 ? 'stock-low' : 'stock-ok'}>{item.stock} units</span> },
  { key: 'price', title: 'Price', sortable: true, render: (item) => `$${item.price.toFixed(2)}` },
  { key: 'status', title: 'Status', render: (item) => <span className={`status-pill${item.status === 'Low stock' ? ' warning' : ''}`}><i />{item.status}</span> },
]

function ExerciseApp() {
  const [query, setQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<Product[]>([])
  const filteredProducts = products.filter((item) =>
    `${item.id} ${item.product} ${item.category} ${item.status}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main className="table-app">
      <header className="table-topbar">
        <a className="table-brand" href="#top"><span className="brand-icon">N</span> NORTH / INVENTORY</a>
        <div className="topbar-right"><span>WORKSPACE</span><strong>Learning store</strong><span className="user-initials">AL</span></div>
      </header>
      <div className="table-content" id="top">
        <div className="breadcrumbs">Workspace <span>/</span> Inventory <span>/</span> <strong>Products</strong></div>
        <section className="table-heading">
          <div><p className="table-kicker">EXERCISE 02 <span>·</span> GENERIC COMPONENTS</p><h1>Products</h1><p>Review inventory, sort columns, and select rows to inspect records.</p></div>
          <button className="export-button" type="button" onClick={() => window.alert(`${selectedItems.length} product(s) selected`)}>↗ <span>Export selection</span></button>
        </section>
        <section className="inventory-panel" aria-label="Product inventory">
          <div className="inventory-summary"><div><strong>Product inventory</strong><small>Updated just now</small></div><span className="inventory-count">{filteredProducts.length} items</span></div>
          <div className="inventory-tools">
            <label className="inventory-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" aria-label="Search products" /></label>
            <button className="filter-button" type="button" onClick={() => setQuery(query ? '' : 'Low stock')}>☷ <span>{query === 'Low stock' ? 'Clear filter' : 'Quick filter'}</span></button>
          </div>
          <DataTable data={filteredProducts} columns={columns} onSelect={setSelectedItems} onSort={(sort) => console.info('Table sort changed', sort.key, sort.direction)} />
          <div className="table-foot"><span>{selectedItems.length ? `${selectedItems.length} selected` : 'Select products to enable bulk actions'}</span><span>Showing {filteredProducts.length} of {products.length}</span></div>
        </section>
        <div className="type-explainer"><span className="type-symbol">T</span><p><strong>One component. Any row shape.</strong><br />Column keys are constrained to <code>keyof T</code>, while <code>render</code> receives the full typed row.</p><span className="generic-label">DataTable&lt;Product&gt;</span></div>
        <footer className="table-footer"><span>ADVANCED TYPESCRIPT / REACT</span><span>EXERCISE 02 OF 03</span></footer>
      </div>
    </main>
  )
}

export default ExerciseApp
