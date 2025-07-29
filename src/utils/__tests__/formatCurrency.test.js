import { describe, it, expect } from 'vitest'
import formatCurrency from '../formatCurrency'

describe('formatCurrency', () => {
  it('formats Indian currency correctly', () => {
    expect(formatCurrency(299)).toBe('₹299')
    expect(formatCurrency(1000)).toBe('₹1,000')
    expect(formatCurrency(100000)).toBe('₹1,00,000')
  })

  it('handles decimal values', () => {
    expect(formatCurrency(299.99)).toBe('₹300')
    expect(formatCurrency(1000.50)).toBe('₹1,001')
  })

  it('handles zero and negative values', () => {
    expect(formatCurrency(0)).toBe('₹0')
    expect(formatCurrency(-100)).toBe('₹-100')
  })

  it('handles string numbers', () => {
    expect(formatCurrency('299')).toBe('₹299')
    expect(formatCurrency('1000')).toBe('₹1,000')
  })
})