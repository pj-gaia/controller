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

type ProductsPagination = {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

type ProductsResponse = {
  data?: Product[]
  meta?: {
    pagination?: ProductsPagination
  }
}

type UseProductsPageParams = {
  page?: number
  pageSize?: number
  sortBy?: string
  filterBy?: string
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 25
const DEFAULT_SORT = 'name:asc'

function buildProductsPath(params: {
  page: number
  pageSize: number
  sortBy: string
  filterBy?: string
}) {
  const search = new URLSearchParams()
  search.set('populate', '*')
  search.set('pagination[page]', String(params.page))
  search.set('pagination[pageSize]', String(params.pageSize))
  search.set('sort[0]', params.sortBy)

  const normalizedFilter = params.filterBy?.trim()
  if (normalizedFilter) {
    search.set('filters[name][$containsi]', normalizedFilter)
  }

  return `/api/products?${search.toString()}`
}

export function useProductsPage(params: UseProductsPageParams = {}) {
  const page = params.page ?? DEFAULT_PAGE
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE
  const sortBy = params.sortBy ?? DEFAULT_SORT
  const filterBy = params.filterBy?.trim() ? params.filterBy.trim() : undefined

  const query = useQuery({
    queryKey: ['products', 'list', { page, pageSize, sortBy, filterBy }],
    queryFn: async () => {
      const path = buildProductsPath({ page, pageSize, sortBy, filterBy })
      return api.get<ProductsResponse>(path)
    },
  })

  return {
    data: query.data?.data ?? [],
    pagination: query.data?.meta?.pagination ?? null,
    isLoading: query.isLoading,
    error: query.error,
  }
}
