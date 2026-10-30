/**
 * Calculates a full-year age from an ISO date string.
 * @param epoch - The birth date in ISO format.
 * @param now - The reference date, defaulting to today.
 * @returns The completed age in years, or zero when the date is invalid.
 */
export function calculateAge(epoch: string, now: Date = new Date()): number {
  const birth = new Date(epoch)

  if (Number.isNaN(birth.getTime())) {
    return 0
  }

  let age = now.getFullYear() - birth.getFullYear()
  const monthDelta = now.getMonth() - birth.getMonth()
  const beforeBirthday = monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())

  if (beforeBirthday) {
    age -= 1
  }

  return Math.max(0, age)
}
