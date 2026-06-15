const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('Missing VITE_API_URL environment variable')
}

export const api = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return response.json() as Promise<T>
  },
}