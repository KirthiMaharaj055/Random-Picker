import { describe, it, expect } from 'vitest'
import { createDerangement } from './derange'

describe('createDerangement', () => {
  it('creates a derangement for 5', () => {
    const res = createDerangement(5)
    expect(res).toHaveLength(5)
    for (let i = 0; i < 5; i++) {
      expect(res[i]).not.toBe(i)
    }
  })

  it('throws for 1', () => {
    expect(() => createDerangement(1)).toThrow()
  })
})
