export function getAgeDifficultyOffset(age: number): -1 | 0 | 1 {
  if (age <= 4) return -1
  if (age <= 6) return 0
  return 1
}
