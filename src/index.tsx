import React, { useState } from 'react'
import { render, Box, Text, useInput, useApp } from 'ink'
import { rollCompanion } from './companion.js'
import { CompanionSprite } from './CompanionSprite.js'
import { loadSave, writeSave, addXP } from './save.js'
import type { SaveData } from './save.js'

function App() {
  const { exit } = useApp()
  const userId    = process.env.USER ?? 'operator'
  const [companion] = useState(() => rollCompanion(userId))
  const [save, setSave]   = useState<SaveData>(() => loadSave())
  const [event, setEvent] = useState<string | undefined>('greet')

  function triggerEvent(e: string) {
    const { data, leveledUp } = addXP(save, e)
    writeSave(data)
    setSave(data)
    setEvent(undefined)
    setTimeout(() => setEvent(leveledUp ? 'levelup' : e), 50)
  }

  useInput((input) => {
    if (input === 'q') exit()
    if (input === 'e') triggerEvent('task')
    if (input === 'r') triggerEvent('error')
    if (input === 'w') triggerEvent('warning')
  })

  return (
    <Box flexDirection="column">
      <Box borderStyle="round" borderColor="cyan" paddingX={1}>
        <Text color="cyan" bold>SCI-FI COMPANION</Text>
        <Text color="gray">  ·  user: {userId}</Text>
      </Box>
      <CompanionSprite
        companion={companion}
        save={save}
        event={event}
        onEventShown={() => setEvent(undefined)}
      />
      <Box paddingX={2} gap={3}>
        <Text color="gray" dimColor>[e] task +10xp</Text>
        <Text color="gray" dimColor>[r] error +5xp</Text>
        <Text color="gray" dimColor>[w] warning +3xp</Text>
        <Text color="gray" dimColor>[q] quit</Text>
      </Box>
    </Box>
  )
}

render(<App />)
