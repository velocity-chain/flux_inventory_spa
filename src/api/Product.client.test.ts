import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api, ApiError } from './client'
import type { ProductInput, ProductUpdate } from './types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Product Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all products', async () => {
    const mockProducts = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-product',
        description: 'Test description',
        status: 'active' as const,
        created: {
          from_ip: '127.0.0.1',
          by_user: 'user1',
          at_time: '2024-01-01T00:00:00Z',
          correlation_id: 'corr-123'
        },
        saved: {
          from_ip: '127.0.0.1',
          by_user: 'user1',
          at_time: '2024-01-01T00:00:00Z',
          correlation_id: 'corr-123'
        }
      }
    ]

    const mockResponse = {
      items: mockProducts,
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.getProducts()

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith('/api/product', expect.any(Object))
  })

  it('should get products with name query', async () => {
    const mockResponse = {
      items: [],
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    await api.getProducts({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/product?name=test',
      expect.any(Object)
    )
  })

  it('should get a single product', async () => {
    const mockProduct = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-product',
      status: 'active' as const,
      created: {
        from_ip: '127.0.0.1',
        by_user: 'user1',
        at_time: '2024-01-01T00:00:00Z',
        correlation_id: 'corr-123'
      },
      saved: {
        from_ip: '127.0.0.1',
        by_user: 'user1',
        at_time: '2024-01-01T00:00:00Z',
        correlation_id: 'corr-123'
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockProduct
    })

    const result = await api.getProduct('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockProduct)
  })

  it('should create a product', async () => {
    const input: ProductInput = {
      name: 'new-product',
      description: 'New description',
      status: 'active'
    }

    const mockResponse = { _id: '507f1f77bcf86cd799439011' }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.createProduct(input)

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/product',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(input)
      })
    )
  })

  it('should update a product', async () => {
    const update: ProductUpdate = { name: 'updated-name' }

    const mockProduct = {
      _id: '507f1f77bcf86cd799439011',
      name: 'updated-name',
      status: 'active' as const,
      created: {
        from_ip: '127.0.0.1',
        by_user: 'user1',
        at_time: '2024-01-01T00:00:00Z',
        correlation_id: 'corr-123'
      },
      saved: {
        from_ip: '127.0.0.1',
        by_user: 'user1',
        at_time: '2024-01-01T00:00:00Z',
        correlation_id: 'corr-123'
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockProduct
    })

    const result = await api.updateProduct('507f1f77bcf86cd799439011', update)

    expect(result).toEqual(mockProduct)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/product/507f1f77bcf86cd799439011',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(update)
      })
    )
  })

  it('should handle 404 errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Resource not found' })
    })

    await expect(api.getProduct('invalid-id')).rejects.toThrow(ApiError)
  })

  it('should handle 401 errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Unauthorized' })
    })

    await expect(api.getProducts()).rejects.toThrow('Unauthorized')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(api.getProducts()).rejects.toThrow('Network error')
  })
})