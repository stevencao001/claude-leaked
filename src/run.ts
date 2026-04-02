import { execSync } from 'child_process'
import { rollCompanion } from './companion.js'
import { loadSave, writeSave, addXP } from './save.js'
import { renderSprite } from './sprites.js'
import { RARITY_COLORS, RARITY_STARS } from './types.js'

const userId   = process.env.USER ?? 'operator'
const companion = rollCompanion(userId)
const color     = RARITY_COLORS[companion.rarity]

function printSprite() {
  const lines = renderSprite(companion, 0)
  for (const line of lines) console.log(line)
}

function speak(msg: string) {
  console.log(`\n  ╭──────────────────────────╮`)
  console.log(`  │ ${msg.padEnd(26)}│`)
  console.log(`  ╰──────────────────────────╯`)
  console.log(`        ╲`)
}

const cmd = process.argv.slice(2).join(' ')
if (!cmd) {
  console.log('Usage: npm run companion -- "<command>"')
  process.exit(1)
}

console.log(`\n  ${companion.name} · ${companion.species.toUpperCase()} · ${RARITY_STARS[companion.rarity]}`)
speak('executing command...')
printSprite()
console.log(`\n  > ${cmd}\n`)

let success = true
try {
  execSync(cmd, { stdio: 'inherit' })
} catch {
  success = false
}

const save = loadSave()
const event = success ? 'task' : 'error'
const { data, leveledUp } = addXP(save, event)
writeSave(data)

console.log('')
if (success) {
  speak(leveledUp
    ? `level up! now LVL ${data.level}. nice.`
    : `task complete. +10 XP  [${data.xp} total]`
  )
} else {
  speak(leveledUp
    ? `failed — but leveled up? chaotic.`
    : `ERROR logged. +5 XP  [${data.xp} total]`
  )
}
printSprite()
console.log('')
