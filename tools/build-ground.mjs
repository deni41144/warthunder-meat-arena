import fs from 'node:fs';

const URL = 'https://raw.githubusercontent.com/Hads84/HadsWarthunderMissions/master/Missions/bot_killer.blk';
const OUT = 'warthunder-fun/missions/usr_fun_arena_ground.mission.blk';

const res = await fetch(URL);
if (!res.ok) throw new Error('download failed ' + res.status);
let s = await res.text();

function blockBounds(str, idx) {
  let i = str.indexOf('{', idx);
  let depth = 0;
  for (; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') { depth--; if (depth === 0) return i + 1; }
  }
  throw new Error('unbalanced');
}

// team B army
s = s.replace(/(player_teamB\{\n\s+army:i=)1/, '$12');

// player_05..08 army
for (const n of ['player_05', 'player_06', 'player_07', 'player_08']) {
  const m = s.indexOf(`name:t="${n}"`);
  if (m < 0) throw new Error('unit ' + n);
  const a = s.indexOf('army:i=', m);
  s = s.slice(0, a) + 'army:i=2' + s.slice(a + 'army:i=1'.length);
}

// horde cap
s = s.split('count:i=255').join('count:i=40');
s = s.split('value:i=100').join('value:i=40');

// split respawns A/B
function splitRespawn(str, locName, targetsA, targetsB) {
  const at = str.indexOf(`loc_name:t="${locName}"`);
  if (at < 0) throw new Error('respawn ' + locName);
  const start = str.lastIndexOf('missionMarkAsRespawnPoint{', at);
  const end = blockBounds(str, start);
  const block = str.slice(start, end);
  const mk = (targets, team) => {
    let out = block.replace(/\n\s+target:t="[^"]*"/g, '');
    const lines = targets.map(t => `        target:t="${t}"`).join('\n');
    out = out.replace(/(\n\s+radius:r=-1)/, `\n${lines}$1`);
    return out.replace(/team:t="Both"/, `team:t="${team}"`);
  };
  return str.slice(0, start) + mk(targetsA, 'A') + '\n\n      ' + mk(targetsB, 'B').replace(/^\s*/, '') + str.slice(end);
}

s = splitRespawn(s, 'Player Spawn',
  ['player_spawn_01', 'player_spawn_02', 'player_spawn_03', 'player_spawn_04'],
  ['player_spawn_05', 'player_spawn_06', 'player_spawn_07', 'player_spawn_08']);
s = splitRespawn(s, 'Air Spawn',
  ['air_spawn_01', 'air_spawn_02', 'air_spawn_03', 'air_spawn_04'],
  ['air_spawn_05', 'air_spawn_06', 'air_spawn_07', 'air_spawn_08']);

// drop team-B blocker
{
  const at = s.indexOf('  set_team_on_spawn{');
  if (at < 0) throw new Error('blocker not found');
  const end = blockBounds(s, at);
  let e = end;
  while (s[e] === '\n') e++;
  s = s.slice(0, at) + s.slice(e);
}

// no ticket bleed + endless score in mission settings
s = s.replace(/(    weather:t="hazy"\n)/, '$1    gt_mp_tickets:b=no\n    scoreLimit:i=999999999\n');

// instant reload trigger for both teams
const players = [];
for (let i = 1; i <= 8; i++) players.push(`player_0${i}`);
const restoreTargets = players.map(t => `        target:t="${t}"`).join('\n');

const trigger = `
  instant_reload{
    is_enabled:b=yes
    comments:t="Refills ammo of every player slot every 0.1s -> effectively instant reload / infinite ammo."

    props{
      actionsType:t="PERFORM_ONE_BY_ONE"
      conditionsType:t="ALL"
      enableAfterComplete:b=yes
    }

    events{
      periodicEvent{
        time:r=0.05
      }
    }

    conditions{}
    actions{
      unitRestore{
        ressurectIfDead:b=no
        fullRestore:b=no
${restoreTargets}
        ammoRestore:b=yes
      }
    }

    else_actions{}
  }
`;

// insert trigger before the triggers block closing (before mission_objectives)
const mo = s.indexOf('\nmission_objectives{');
if (mo < 0) throw new Error('mission_objectives not found');
s = s.slice(0, mo) + trigger + s.slice(mo);

// sanity
let depth = 0;
for (const ch of s) { if (ch === '{') depth++; else if (ch === '}') depth--; }
if (depth !== 0) throw new Error('unbalanced ' + depth);

fs.writeFileSync(OUT, s, 'utf8');
console.log('written', OUT, s.length, 'bytes');
