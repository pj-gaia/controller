import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

type StrapiEntity<T> = {
  id: number
  documentId?: string
} & T

export type Component = StrapiEntity<{
  name: string
  sonar_project_key?: string | null
}>

export type Product = StrapiEntity<{
  name: string
  slug: string
  description?: string | null
  criticality_tier?: string | null
  components?: Component[]
}>

type ProductsResponse = {
  data?: Product[]
}

function readRichText(value: unknown): string | null {
  if (typeof value === 'string') {
    const normalized = value.trim()
    return normalized.length > 0 ? normalized : null
  }

  if (!Array.isArray(value)) {
    return null
  }

  const text = value
    .flatMap((block) => {
      if (
        typeof block === 'object' &&
        block !== null &&
        'children' in block &&
        Array.isArray((block as { children: unknown[] }).children)
      ) {
        return (block as { children: unknown[] }).children
          .map((child) => {
            if (
              typeof child === 'object' &&
              child !== null &&
              'text' in child &&
              typeof (child as { text?: unknown }).text === 'string'
            ) {
              return (child as { text: string }).text
            }

            return ''
          })
          .join('')
      }

      return ''
    })
    .join('\n')
    .trim()

  return text.length > 0 ? text : null
}

function normalizeProducts(products: Product[] | undefined): Product[] {
  return (products ?? []).map((product) => ({
    ...product,
    description: readRichText(product.description),
  }))
}

export function useProducts() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<ProductsResponse>('/api/products?populate=*')
      return normalizeProducts(response.data)
    },
  })

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
