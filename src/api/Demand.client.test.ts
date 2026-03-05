import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Demand Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all demands', async () => {
    const mockDemands = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-demand',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockDemands,
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

    const result = await api.getDemands()

    expect(result).toEqual(mockResponse)
  })

  it('should get demands with name query', async () => {
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

    await api.getDemands({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/demand?name=test',
      expect.any(Object)
    )
  })

  it('should get a single demand', async () => {
    const mockDemand = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-demand'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockDemand
    })

    const result = await api.getDemand('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockDemand)
  })
})