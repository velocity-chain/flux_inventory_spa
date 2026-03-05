import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api, ApiError } from './client'
import type { InventoryInput, InventoryUpdate } from './types'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Inventory Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all inventorys', async () => {
    const mockInventorys = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-inventory',
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
      items: mockInventorys,
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

    const result = await api.getInventorys()

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith('/api/inventory', expect.any(Object))
  })

  it('should get inventorys with name query', async () => {
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

    await api.getInventorys({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/inventory?name=test',
      expect.any(Object)
    )
  })

  it('should get a single inventory', async () => {
    const mockInventory = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-inventory',
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
      json: async () => mockInventory
    })

    const result = await api.getInventory('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockInventory)
  })

  it('should create a inventory', async () => {
    const input: InventoryInput = {
      name: 'new-inventory',
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

    const result = await api.createInventory(input)

    expect(result).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/inventory',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(input)
      })
    )
  })

  it('should update a inventory', async () => {
    const update: InventoryUpdate = { name: 'updated-name' }

    const mockInventory = {
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
      json: async () => mockInventory
    })

    const result = await api.updateInventory('507f1f77bcf86cd799439011', update)

    expect(result).toEqual(mockInventory)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/inventory/507f1f77bcf86cd799439011',
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

    await expect(api.getInventory('invalid-id')).rejects.toThrow(ApiError)
  })

  it('should handle 401 errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Unauthorized' })
    })

    await expect(api.getInventorys()).rejects.toThrow('Unauthorized')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(api.getInventorys()).rejects.toThrow('Network error')
  })
})