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

type RawProduct = StrapiEntity<{
  name: string
  slug: string
  description?: unknown
  criticality_tier?: string | null
  components?: Component[]
}>

type ProductsResponse = {
  data?: RawProduct[]
}

function flattenText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => flattenText(item)).join(' ')
  }

  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>

    if (typeof record.text === 'string') {
      return record.text
    }

    if ('children' in record) {
      return flattenText(record.children)
    }
  }

  return ''
}

function readRichText(value: unknown): string | null {
  const normalized = flattenText(value).replace(/\s+/g, ' ').trim()
  return normalized.length > 0 ? normalized : null
}

function normalizeProducts(products: RawProduct[] | undefined): Product[] {
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
