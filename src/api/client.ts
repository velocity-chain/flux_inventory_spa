import type { 
  Inventory,
  InventoryInput,
  InventoryUpdate,

  Product,
  ProductInput,
  ProductUpdate,

  Shipment,
  ShipmentInput,

  Demand,

  Warehouse,

  Optimization,

  DevLoginRequest, 
  DevLoginResponse,
  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

function getDevLoginUrl(): string {
  return '/dev-login'
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: Error | null = null
    try {
      errorData = await response.json()
    } catch {
      // Ignore JSON parse errors
    }
    
    // Handle 401 Unauthorized - clear invalid token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      // Redirect to login page, preserving current path for post-login redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData || undefined
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Authentication
  async devLogin(payload?: DevLoginRequest): Promise<DevLoginResponse> {
    const url = getDevLoginUrl()
    const token = localStorage.getItem('access_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      let errorData: Error | null = null
      try {
        errorData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData || undefined
      )
    }

    return response.json()
  },

  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // These types are compatible with spa_utils useInfiniteScroll composable

  async getInventorys(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Inventory>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Inventory>>(`/inventory${query ? `?${query}` : ''}`)
  },

  async getInventory(inventoryId: string): Promise<Inventory> {
    return request<Inventory>(`/inventory/${inventoryId}`)
  },

  async createInventory(data: InventoryInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateInventory(inventoryId: string, data: InventoryUpdate): Promise<Inventory> {
    return request<Inventory>(`/inventory/${inventoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },


  async getProducts(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Product>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Product>>(`/product${query ? `?${query}` : ''}`)
  },

  async getProduct(productId: string): Promise<Product> {
    return request<Product>(`/product/${productId}`)
  },

  async createProduct(data: ProductInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/product', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateProduct(productId: string, data: ProductUpdate): Promise<Product> {
    return request<Product>(`/product/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints

  async getShipments(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Shipment>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Shipment>>(`/shipment${query ? `?${query}` : ''}`)
  },

  async getShipment(shipmentId: string): Promise<Shipment> {
    return request<Shipment>(`/shipment/${shipmentId}`)
  },

  async createShipment(data: ShipmentInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/shipment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },



  // Consume endpoints

  async getDemands(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Demand>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Demand>>(`/demand${query ? `?${query}` : ''}`)
  },

  async getDemand(demandId: string): Promise<Demand> {
    return request<Demand>(`/demand/${demandId}`)
  },


  async getWarehouses(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Warehouse>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Warehouse>>(`/warehouse${query ? `?${query}` : ''}`)
  },

  async getWarehouse(warehouseId: string): Promise<Warehouse> {
    return request<Warehouse>(`/warehouse/${warehouseId}`)
  },


  async getOptimizations(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Optimization>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Optimization>>(`/optimization${query ? `?${query}` : ''}`)
  },

  async getOptimization(optimizationId: string): Promise<Optimization> {
    return request<Optimization>(`/optimization/${optimizationId}`)
  },


}

export { ApiError }
