export function createDerangement(n: string[] | number): number[] {
  // If input is an array of ids, return an array of indices representing the deranged positions
  let len: number
  if (Array.isArray(n)) len = n.length
  else len = n
  if (len <= 1) throw new Error('Need at least 2 participants')

  // simple algorithm: shuffle until no fixed points (expected O(e) tries)
  const indices = Array.from({ length: len }, (_, i) => i)
  for (let attempt = 0; attempt < 1000; attempt++) {
    shuffle(indices)
    let ok = true
    for (let i = 0; i < len; i++) {
      if (indices[i] === i) {
        ok = false
        break
      }
    }
    if (ok) return indices
  }
  throw new Error('Could not generate derangement')
}

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

export function pickOne<T>(arr: T[]): T | undefined {
  if (!arr || arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}
