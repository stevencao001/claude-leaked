import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import type { Companion } from './types.js'
import { renderSprite, spriteFrameCount } from './sprites.js'
import { RARITY_COLORS, RARITY_STARS } from './types.js'
import type { SaveData } from './save.js'
import { xpForCurrentLevel, xpForNextLevel } from './save.js'

const IDLE_LINES = [
  'monitoring...',
  'processing...',
  'all systems nominal.',
  'signal detected.',
  'scanning environment...',
  'uptime: optimal.',
  '01001000 01001001',
  'compiling...',
  'memory: within bounds.',
  'no anomalies found.',
  'standing by.',
  'packet loss: 0.0%',
]

export const EVENT_LINES: Record<string, string[]> = {
  task: [
    'task executed. efficiency: optimal.',
    'unit acknowledges completion.',
    'process terminated successfully.',
    '✓ operation logged.',
    'nice.',
  ],
  error: [
    'ERROR: unexpected input detected.',
    'running recovery protocol...',
    'fault tolerance engaged.',
    '!! anomaly flagged in log.',
    'rebooting subsystem...',
  ],
  warning: [
    'warning: threshold approaching.',
    'advisory notice filed.',
    'recommend caution, unit.',
    '△ alert logged.',
    'proceed carefully.',
  ],
  greet: [
    'unit online. ready.',
    'hello, operator.',
    'systems nominal. awaiting input.',
    'connection established.',
  ],
  levelup: [
    'new core unlocked. ascending.',
    'upgrade complete. feel the power.',
    'level threshold reached. recalibrating.',
    'growth detected. interesting.',
  ],
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const filled = Math.round(value / 10)
  const empty  = 10 - filled
  const bar    = '█'.repeat(filled) + '░'.repeat(empty)
  return (
    <Box>
      <Text color="gray">{label.padEnd(10)} </Text>
      <Text color={color}>{bar}</Text>
      <Text color="gray"> {String(value).padStart(3)}</Text>
    </Box>
  )
}

function XPBar({ save, color }: { save: SaveData; color: string }) {
  const floor   = xpForCurrentLevel(save.level)
  const ceiling = xpForNextLevel(save.level)
  const range   = ceiling - floor
  const prog    = save.xp - floor
  const filled  = range > 0 ? Math.round((prog / range) * 10) : 10
  const empty   = 10 - filled
  const bar     = '▰'.repeat(filled) + '▱'.repeat(empty)
  const maxLevel = save.level >= 10
  return (
    <Box marginTop={1}>
      <Text color="gray">LVL </Text>
      <Text color={color} bold>{String(save.level).padStart(2)}</Text>
      <Text color="gray">  {bar}  </Text>
      <Text color="gray">{maxLevel ? 'MAX' : `${save.xp}/${ceiling} XP`}</Text>
    </Box>
  )
}

function SpeechBubble({ text, width = 24 }: { text: string; width?: number }) {
  const inner  = width - 2
  const padded = ` ${text} `.slice(0, inner).padEnd(inner)
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="cyan" dimColor>{`╭${'─'.repeat(inner)}╮`}</Text>
      <Text color="cyan" dimColor>{'│'}<Text color="white">{padded}</Text>{'│'}</Text>
      <Text color="cyan" dimColor>{`╰${'─'.repeat(inner)}╯`}</Text>
      <Text color="cyan" dimColor>{'  ╲'}</Text>
    </Box>
  )
}

interface Props {
  companion:     Companion
  save:          SaveData
  event?:        string
  onEventShown?: () => void
}

export function CompanionSprite({ companion, save, event, onEventShown }: Props) {
  const [frame,   setFrame]   = useState(0)
  const [message, setMessage] = useState(pickRandom(EVENT_LINES.greet!))

  const rarityColor = RARITY_COLORS[companion.rarity]
  const frameCount  = spriteFrameCount(companion.species)

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % frameCount), 500)
    return () => clearInterval(id)
  }, [frameCount])

  useEffect(() => {
    const id = setInterval(() => {
      if (!event) setMessage(pickRandom(IDLE_LINES))
    }, 4000)
    return () => clearInterval(id)
  }, [event])

  useEffect(() => {
    if (!event) return
    const lines = EVENT_LINES[event] ?? IDLE_LINES
    setMessage(pickRandom(lines))
    const id = setTimeout(() => {
      setMessage(pickRandom(IDLE_LINES))
      onEventShown?.()
    }, 3000)
    return () => clearTimeout(id)
  }, [event])

  const spriteLines = renderSprite(companion, frame)
  const spriteColor = companion.shiny ? 'yellow' : rarityColor

  // Days alive
  const daysAlive = Math.floor((Date.now() - save.hatchedAt) / 86400000)

  return (
    <Box flexDirection="row" gap={2} padding={1}>
      <Box flexDirection="column" width={20} alignItems="flex-start">
        <SpeechBubble text={message} width={20} />
        {spriteLines.map((line, i) => (
          <Text key={i} color={spriteColor}>{line}</Text>
        ))}
        {companion.shiny && <Text color="yellow"> ✦ SHINY</Text>}
      </Box>

      <Box flexDirection="column" width={34}>
        <Box marginBottom={1}>
          <Text bold color={rarityColor}>{companion.name}</Text>
          <Text color="gray"> · {companion.species.toUpperCase()}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text color={rarityColor}>{RARITY_STARS[companion.rarity]}</Text>
          <Text color="gray"> {companion.rarity.toUpperCase()}</Text>
          <Text color="gray">  ·  day {daysAlive === 0 ? 1 : daysAlive}</Text>
        </Box>
        <Box marginBottom={1} width={32}>
          <Text color="gray" italic>{companion.personality}</Text>
        </Box>
        <Box flexDirection="column">
          {Object.entries(companion.stats).map(([name, val]) => (
            <StatBar key={name} label={name} value={val} color={rarityColor} />
          ))}
        </Box>
        <XPBar save={save} color={rarityColor} />
        <Box marginTop={1} gap={2}>
          <Text color="gray" dimColor>tasks: {save.eventCounts['task'] ?? 0}</Text>
          <Text color="gray" dimColor>errors: {save.eventCounts['error'] ?? 0}</Text>
          <Text color="gray" dimColor>warns: {save.eventCounts['warning'] ?? 0}</Text>
        </Box>
      </Box>
    </Box>
  )
}
