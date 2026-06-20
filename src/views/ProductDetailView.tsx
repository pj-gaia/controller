import { Link, useParams } from '@tanstack/react-router'
import { useProducts } from '../hooks/useProducts'

export function ProductDetailView() {
  const { productId } = useParams({ from: '/products/$productId' })
  const { data: products, isLoading, error } = useProducts()

  const product = products.find(
    (item) => String(item.documentId ?? item.id) === productId,
  )

  if (isLoading) {
    return (
      <section className="view">
        <div className="skeleton-card skeleton-card--wide" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="view">
        <div className="state-card state-card--error">
          Unable to load product details.
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="view">
        <Link to="/products" className="back-link">
          ← Back to products
        </Link>
        <div className="state-card">Product not found.</div>
      </section>
    )
  }

  return (
    <section className="view">
      <Link to="/products" className="back-link">
        ← Back to products
      </Link>
      <p className="eyebrow">Product Detail</p>
      <h1>{product.name}</h1>
      <p>{product.description || 'No description provided.'}</p>
      <h2>Components</h2>
      {product.components && product.components.length > 0 ? (
        <div className="component-list">
          {product.components.map((component) => (
            <article
              key={component.documentId ?? component.id}
              className="component-card"
            >
              <h3>{component.name}</h3>
              <p>
                Sonar project key:{' '}
                <code>{component.sonar_project_key || 'Not provided'}</code>
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="state-card">No linked components found.</div>
      )}
    </section>
  )
}
