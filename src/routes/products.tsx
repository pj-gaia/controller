import { createFileRoute } from '@tanstack/react-router'
import { ProductCatalogView } from '../views/ProductCatalogView'

export const Route = createFileRoute('/products')({
  component: ProductCatalogView,
})
