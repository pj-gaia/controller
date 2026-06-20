import { useEffect, useState } from 'react'
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
  data: Product[]
}

export function useProducts() {
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchProducts() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await api.get<ProductsResponse>('/api/products?populate=*')

        if (isMounted) {
          setData(response.data ?? [])
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error('Failed to load products'),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, isLoading, error }
}
