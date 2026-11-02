import fs from 'node:fs';

const src = 'warthunder-fun/ref/sinai_instant_reload.blk';
const dst = 'warthunder-fun/missions/usr_fun_arena_air.mission.blk';

let s = fs.readFileSync(src, 'utf8');

// 1. Display name
s = s.replace('locName:t="[Domination] Sinai - TSS"', 'locName:t="MEAT ARENA - Sinai (fast fire)"');

// 2. Helpers
function blockBounds(str, idx) {
  let i = str.indexOf('{', idx);
  let depth = 0;
  for (; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') { depth--; if (depth === 0) return i + 1; }
  }
  throw new Error('unbalanced');
}

// 3. Aircraft thrust multiplier trigger
const targets = [];
for (let i = 1; i <= 16; i++) targets.push(`BluePlayer${String(i).padStart(2, '0')}`);
for (let i = 1; i <= 16; i++) targets.push(`RedPlayer${String(i).padStart(2, '0')}`);

const objLines = targets.map(t => `        object:t="${t}"`).join('\n');

const thrustTrigger = `
  thrust_multiplier{
    is_enabled:b=yes
    comments:t="Aircraft engine thrust x10 for every player slot. Set thrust_mult to 1 to disable."

    props{
      actionsType:t="PERFORM_ONE_BY_ONE"
      conditionsType:t="ALL"
      enableAfterComplete:b=yes
    }

    events{
      initMission{}
    }

    conditions{}
    actions{
      unitSetProperties{
${objLines}
        plane{
          thrust_mult:r=10
        }
      }
    }

    else_actions{}
  }
`;

const at = s.indexOf('  instant_reload{');
if (at < 0) throw new Error('instant_reload not found');
const end = blockBounds(s, at);

// speed up the reload loop: 0.1s -> 0.05s
const irBlock = s.slice(at, end).replace('time:r=0.1', 'time:r=0.05');
s = s.slice(0, at) + irBlock + s.slice(end);

s = s.slice(0, end) + '\n' + thrustTrigger + s.slice(end);

// 4. Sanity
let depth = 0;
for (const ch of s) { if (ch === '{') depth++; else if (ch === '}') depth--; }
if (depth !== 0) throw new Error('unbalanced braces ' + depth);

fs.writeFileSync(dst, s, 'utf8');
console.log('written', dst, s.length, 'bytes');
