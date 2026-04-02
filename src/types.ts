export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const
export type Rarity = (typeof RARITIES)[number]

export const RARITY_WEIGHTS = {
  common:    60,
  uncommon:  25,
  rare:      10,
  epic:       4,
  legendary:  1,
} as const satisfies Record<Rarity, number>

export const RARITY_STARS: Record<Rarity, string> = {
  common:    '★',
  uncommon:  '★★',
  rare:      '★★★',
  epic:      '★★★★',
  legendary: '★★★★★',
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common:    'gray',
  uncommon:  'green',
  rare:      'blue',
  epic:      'magenta',
  legendary: 'yellow',
}

export const SPECIES = [
  'android', 'drone',  'alien',  'glitch',
  'probe',   'mech',   'virus',  'core',
] as const
export type Species = (typeof SPECIES)[number]

export const EYES = ['·', '◉', '×', '@', '○', '◈', '»', '■'] as const
export type Eye = (typeof EYES)[number]

export const HATS = ['none', 'antenna', 'visor', 'uplink', 'spike', 'halo'] as const
export type Hat = (typeof HATS)[number]

export const STAT_NAMES = ['PROCESSING', 'FIREWALL', 'GLITCH', 'BANDWIDTH', 'UPTIME'] as const
export type StatName = (typeof STAT_NAMES)[number]

export type CompanionBones = {
  rarity:  Rarity
  species: Species
  eye:     Eye
  hat:     Hat
  shiny:   boolean
  stats:   Record<StatName, number>
}

export type CompanionSoul = {
  name:        string
  personality: string
}

export type Companion = CompanionBones & CompanionSoul & { hatchedAt: number }
