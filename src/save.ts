import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const SAVE_PATH = resolve('./companion.save.json')

export type SaveData = {
  hatchedAt:   number
  xp:          number
  level:       number
  eventCounts: Record<string, number>
}

export const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1100, 1500, 2000, 2600]

export const XP_PER_EVENT: Record<string, number> = {
  task:    10,
  error:    5,
  warning:  3,
}

export function getLevelFromXP(xp: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]!) level = i + 1
  }
  return Math.min(level, LEVEL_THRESHOLDS.length)
}

export function xpForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]!
}

export function xpForCurrentLevel(level: number): number {
  return LEVEL_THRESHOLDS[level - 1] ?? 0
}

export function loadSave(): SaveData {
  try {
    const raw = readFileSync(SAVE_PATH, 'utf8')
    return JSON.parse(raw) as SaveData
  } catch {
    return {
      hatchedAt:   Date.now(),
      xp:          0,
      level:       1,
      eventCounts: { task: 0, error: 0, warning: 0 },
    }
  }
}

export function writeSave(data: SaveData): void {
  writeFileSync(SAVE_PATH, JSON.stringify(data, null, 2))
}

export function addXP(
  data: SaveData,
  event: string,
): { data: SaveData; leveledUp: boolean } {
  const gained   = XP_PER_EVENT[event] ?? 0
  const newXP    = data.xp + gained
  const newLevel = getLevelFromXP(newXP)
  const leveledUp = newLevel > data.level
  return {
    data: {
      ...data,
      xp:    newXP,
      level: newLevel,
      eventCounts: {
        ...data.eventCounts,
        [event]: (data.eventCounts[event] ?? 0) + 1,
      },
    },
    leveledUp,
  }
}
