import {
  type Companion,
  type CompanionBones,
  EYES, HATS, RARITIES, RARITY_WEIGHTS,
  type Rarity, SPECIES, STAT_NAMES, type StatName,
} from './types.js'

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}

function rollRarity(rng: () => number): Rarity {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0)
  let roll = rng() * total
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity]
    if (roll < 0) return rarity
  }
  return 'common'
}

const RARITY_FLOOR: Record<Rarity, number> = {
  common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50,
}

function rollStats(rng: () => number, rarity: Rarity): Record<StatName, number> {
  const floor = RARITY_FLOOR[rarity]
  const peak = pick(rng, STAT_NAMES)
  let dump = pick(rng, STAT_NAMES)
  while (dump === peak) dump = pick(rng, STAT_NAMES)
  const stats = {} as Record<StatName, number>
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30))
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15))
    } else {
      stats[name] = floor + Math.floor(rng() * 40)
    }
  }
  return stats
}

const NAMES = [
  'AXIOM', 'BYTE', 'CIPHER', 'DELTA', 'ECHO', 'FLUX', 'GRID', 'HEX',
  'ION', 'JOLT', 'KRYPTO', 'LUMEN', 'MATRIX', 'NANO', 'ORBIT', 'PIXEL',
  'QUBIT', 'ROGUE', 'SIGMA', 'TITAN', 'ULTRA', 'VECTOR', 'WARP', 'XENON',
  'YIELD', 'ZERO',
]

const PERSONALITIES = [
  'Runs diagnostics constantly. Very into uptime.',
  'Collects data on everything. Slightly unsettling.',
  'Overclocked and proud of it.',
  'Speaks in binary when excited.',
  'Has strong opinions about compression algorithms.',
  'Prefers cold boot over sleep mode.',
  'Technically sentient. Working through it.',
  'Optimized for chaos. Thriving.',
  'Haunted by a memory leak from 2019.',
  'Refuses to garbage collect. It is a choice.',
]

const SALT = 'sci-fi-companion-v1'

export function rollCompanion(userId: string): Companion {
  const rng = mulberry32(hashString(userId + SALT))
  const rarity = rollRarity(rng)
  const bones: CompanionBones = {
    rarity,
    species: pick(rng, SPECIES),
    eye:     pick(rng, EYES),
    hat:     rarity === 'common' ? 'none' : pick(rng, HATS),
    shiny:   rng() < 0.01,
    stats:   rollStats(rng, rarity),
  }
  return {
    ...bones,
    name:        pick(rng, NAMES),
    personality: pick(rng, PERSONALITIES),
    hatchedAt:   Date.now(),
  }
}
