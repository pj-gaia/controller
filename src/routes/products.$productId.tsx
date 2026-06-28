import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailView } from '../views/ProductDetailView'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetailView,
})
