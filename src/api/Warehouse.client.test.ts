import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Warehouse Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all warehouses', async () => {
    const mockWarehouses = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-warehouse',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockWarehouses,
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

    const result = await api.getWarehouses()

    expect(result).toEqual(mockResponse)
  })

  it('should get warehouses with name query', async () => {
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

    await api.getWarehouses({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/warehouse?name=test',
      expect.any(Object)
    )
  })

  it('should get a single warehouse', async () => {
    const mockWarehouse = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-warehouse'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockWarehouse
    })

    const result = await api.getWarehouse('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockWarehouse)
  })
})