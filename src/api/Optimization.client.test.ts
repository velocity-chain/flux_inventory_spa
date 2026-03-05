import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - Optimization Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all optimizations', async () => {
    const mockOptimizations = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-optimization',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockOptimizations,
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

    const result = await api.getOptimizations()

    expect(result).toEqual(mockResponse)
  })

  it('should get optimizations with name query', async () => {
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

    await api.getOptimizations({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/optimization?name=test',
      expect.any(Object)
    )
  })

  it('should get a single optimization', async () => {
    const mockOptimization = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-optimization'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockOptimization
    })

    const result = await api.getOptimization('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockOptimization)
  })
})