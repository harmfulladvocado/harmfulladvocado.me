import { describe, expect, it } from 'vitest'

import { calculateAge } from './age.ts'

describe('calculateAge', () => {
  it('counts the age after the birthday has passed', () => {
    expect(calculateAge('2010-05-30', new Date('2026-10-29T12:00:00'))).toBe(16)
  })

  it('counts the previous age before the birthday', () => {
    expect(calculateAge('2010-05-30', new Date('2026-05-29T12:00:00'))).toBe(15)
  })

  it('counts the new age on the birthday', () => {
    expect(calculateAge('2010-05-30', new Date('2026-05-30T00:00:00'))).toBe(16)
  })

  it('returns zero for invalid dates', () => {
    expect(calculateAge('not-a-date', new Date('2026-10-29T12:00:00'))).toBe(0)
  })
})
