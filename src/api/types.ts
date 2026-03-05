// Type definitions based on OpenAPI spec

export interface Error {
  error: string
}

export interface Breadcrumb {
  from_ip: string
  by_user: string
  at_time: string
  correlation_id: string
}


// Inventory Domain
export interface Inventory {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface InventoryInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface InventoryUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// Product Domain
export interface Product {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface ProductInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface ProductUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}


// Shipment Domain
export interface Shipment {
  _id: string
  name: string
  description?: string
  status?: string
  created: Breadcrumb
}

export interface ShipmentInput {
  name: string
  description?: string
  status?: string
}


// Demand Domain
export interface Demand {
  _id: string
  name: string
  description?: string
  status?: string
}

// Warehouse Domain
export interface Warehouse {
  _id: string
  name: string
  description?: string
  status?: string
}

// Optimization Domain
export interface Optimization {
  _id: string
  name: string
  description?: string
  status?: string
}


// Authentication
export interface DevLoginRequest {
  subject?: string
  roles?: string[]
}

export interface DevLoginResponse {
  access_token: string
  token_type: string
  expires_at: string
  subject: string
  roles: string[]
}

// Configuration
export interface ConfigResponse {
  config_items: unknown[]
  versions: unknown[]
  enumerators: unknown[]
  token?: {
    claims?: Record<string, unknown>
  }
}

// Infinite Scroll
export interface InfiniteScrollParams {
  name?: string
  after_id?: string
  limit?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface InfiniteScrollResponse<T> {
  items: T[]
  limit: number
  has_more: boolean
  next_cursor: string | null
}
