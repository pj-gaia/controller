import { Link } from '@tanstack/react-router'
import { useProducts } from '../hooks/useProducts'

export function ProductCatalogView() {
  const { data: products, isLoading, error } = useProducts()

  if (isLoading) {
    return (
      <section className="view">
        <p className="eyebrow">Products</p>
        <h1>Product Catalog</h1>
        <div className="grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="view">
        <p className="eyebrow">Products</p>
        <h1>Product Catalog</h1>
        <div className="state-card state-card--error">
          Unable to load products from the registry. Please check that the
          registry API is running.
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="view">
        <p className="eyebrow">Products</p>
        <h1>Product Catalog</h1>
        <div className="state-card">No products have been registered yet.</div>
      </section>
    )
  }

  return (
    <section className="view">
      <p className="eyebrow">Products</p>
      <h1>Product Catalog</h1>
      <div className="grid">
        {products.map((product) => (
          <Link
            key={product.documentId ?? product.id}
            to="/products/$productId"
            params={{ productId: String(product.documentId ?? product.id) }}
            className="product-card"
          >
            <div>
              <h2>{product.name}</h2>
              <p>{product.description || 'No description provided.'}</p>
            </div>
            <div className="card-meta">
              <span>{product.criticality_tier || 'No tier assigned'}</span>
              <span>{product.components?.length ?? 0} components</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
