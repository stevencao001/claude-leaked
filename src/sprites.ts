import type { CompanionBones, Hat, Species } from './types.js'

const BODIES: Record<Species, string[][]> = {
  android: [
    [
      '            ',
      '   .[||].   ',
      '  [ {E}  {E} ]  ',
      '  [ ==== ]  ',
      '  `------´  ',
    ],
    [
      '            ',
      '   .[||].   ',
      '  [ {E}  {E} ]  ',
      '  [ -==- ]  ',
      '  `------´  ',
    ],
    [
      '     *      ',
      '   .[||].   ',
      '  [ {E}  {E} ]  ',
      '  [ ==== ]  ',
      '  `------´  ',
    ],
  ],
  drone: [
    [
      '            ',
      '  .-====-.  ',
      ' ( {E}    {E} ) ',
      '  `------´  ',
      '  =|    |=  ',
    ],
    [
      '            ',
      '  .-====-.  ',
      ' ( {E}    {E} ) ',
      '  `------´  ',
      '  =|    |=~ ',
    ],
    [
      '     °      ',
      '  .-====-.  ',
      ' ( {E}    {E} ) ',
      '  `------´  ',
      '  =|    |=  ',
    ],
  ],
  alien: [
    [
      ' ~  ~~~  ~  ',
      '  .------.  ',
      ' ({E}  v  {E})  ',
      '  ( ---- )  ',
      '   `----´   ',
    ],
    [
      ' ~~  ~  ~~  ',
      '  .------.  ',
      ' ({E}  ^  {E})  ',
      '  ( ---- )  ',
      '   `----´   ',
    ],
    [
      '  ~  ~~  ~  ',
      '  .------.  ',
      ' ({E}  v  {E})  ',
      '  ( ==== )  ',
      '   `----´   ',
    ],
  ],
  glitch: [
    [
      '            ',
      '  /------\  ',
      '  |{E} /\ {E}|  ',
      '  |------|  ',
      '  /|    |\  ',
    ],
    [
      '  %%    %%  ',
      '  /------\  ',
      '  |{E} \/ {E}|  ',
      '  |--/---|  ',
      '  /|    |\  ',
    ],
    [
      '            ',
      '  /--/---\  ',
      '  |{E} /\ {E}|  ',
      '  |------|  ',
      '  /|\  /|\  ',
    ],
  ],
  probe: [
    [
      '     |      ',
      '   .===.    ',
      '  ({E}   {E})   ',
      '   `===´    ',
      '   -| |-    ',
    ],
    [
      '     |      ',
      '   .===.    ',
      '  ({E}   {E})   ',
      '   `===´    ',
      '   /| |\    ',
    ],
    [
      '     |°     ',
      '   .===.    ',
      '  ({E}   {E})   ',
      '   `===´    ',
      '   -| |-    ',
    ],
  ],
  mech: [
    [
      '            ',
      ' _|_    _|_ ',
      ' |{E}|__|{E}|  ',
      ' |  []  |   ',
      ' |__|  |__| ',
    ],
    [
      '            ',
      ' _|_    _|_ ',
      ' |{E}|__|{E}|  ',
      ' | [==] |   ',
      ' |__|  |__| ',
    ],
    [
      '  *         ',
      ' _|_    _|_ ',
      ' |{E}|__|{E}|  ',
      ' |  []  |   ',
      ' |_/  \_|   ',
    ],
  ],
  virus: [
    [
      '  * . * .   ',
      '  .------.  ',
      ' *|{E}  . {E}|* ',
      '  |  <>  |  ',
      '  *------*  ',
    ],
    [
      '  . * . *   ',
      '  .------.  ',
      ' .|{E} .  {E}|. ',
      '  |  <> .|  ',
      '  *------*  ',
    ],
    [
      '  * . * .   ',
      '  .------.  ',
      ' *|{E}  . {E}|* ',
      '  | [<>] |  ',
      '  .------*  ',
    ],
  ],
  core: [
    [
      '            ',
      '   /====\   ',
      '  |{E} oo {E}|  ',
      '  |  __  |  ',
      '   \====/   ',
    ],
    [
      '            ',
      '   /====\   ',
      '  |{E} oo {E}|  ',
      '  | (  ) |  ',
      '   \====/   ',
    ],
    [
      '    ~  ~    ',
      '   /====\   ',
      '  |{E} OO {E}|  ',
      '  |  __  |  ',
      '   \====/   ',
    ],
  ],
}

const HAT_LINES: Record<Hat, string> = {
  none:    '',
  antenna: '     |      ',
  visor:   '   [===]    ',
  uplink:  '   /===\    ',
  spike:   '    /|\     ',
  halo:    '   (   )    ',
}

export function renderSprite(bones: CompanionBones, frame = 0): string[] {
  const frames = BODIES[bones.species]
  const body = frames[frame % frames.length]!.map(line =>
    line.replaceAll('{E}', bones.eye),
  )
  const lines = [...body]
  if (bones.hat !== 'none' && !lines[0]!.trim()) {
    lines[0] = HAT_LINES[bones.hat]
  }
  if (!lines[0]!.trim() && frames.every(f => !f[0]!.trim())) {
    lines.shift()
  }
  return lines
}

export function spriteFrameCount(species: Species): number {
  return BODIES[species].length
}
