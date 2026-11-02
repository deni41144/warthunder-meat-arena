import fs from 'node:fs';

const p = 'warthunder-fun/missions/usr_fun_arena.mission.blk';
const s = fs.readFileSync(p, 'utf8');

const fail = (m) => { console.error('FAIL: ' + m); process.exitCode = 1; };
const ok = (m) => console.log('ok: ' + m);

// 1. braces
let d = 0;
for (const ch of s) { if (ch === '{') d++; else if (ch === '}') d--; }
d === 0 ? ok('braces balanced') : fail('brace depth ' + d);

// 2. forbidden leftovers
/count:i=255/.test(s) ? fail('count:i=255 still present') : ok('no 255 horde count');
/set_team_on_spawn/.test(s) ? fail('set_team_on_spawn still present') : ok('team-B blocker removed');

// 3. top-level blocks
for (const b of ['mission_settings', 'imports', 'triggers', 'mission_objectives', 'variables', 'dialogs', 'airfields', 'effects', 'units', 'areas', 'objLayers', 'wayPoints']) {
  new RegExp('^' + b + '\\{', 'm').test(s) ? ok('block ' + b) : fail('missing block ' + b);
}

// 4. respawn points
const respawns = s.match(/missionMarkAsRespawnPoint\{/g) || [];
respawns.length === 4 ? ok('4 respawn actions (2 tank + 2 air)') : fail('respawn actions = ' + respawns.length);

// 5. area names
const areasIdx = s.indexOf('\nareas{');
const unitsIdx = s.indexOf('\nunits{');
const areasText = s.slice(areasIdx, s.indexOf('\nobjLayers{'));
const areaNames = [...areasText.matchAll(/^  ([A-Za-z0-9_]+)\{/gm)].map(m => m[1]);
ok('areas: ' + areaNames.join(', '));

// 6. every respawn target must exist in areas
const targets = [...s.matchAll(/target:t="([a-z0-9_]+_spawn_\d+)"/g)].map(m => m[1]);
let badTargets = targets.filter(t => !areaNames.includes(t));
badTargets.length ? fail('respawn targets missing in areas: ' + [...new Set(badTargets)].join(', ')) : ok('all ' + new Set(targets).size + ' respawn targets exist');

// 7. units referenced by wings exist
const unitNames = [...s.matchAll(/^    name:t="([A-Za-z0-9_]+)"/gm)].map(m => m[1]);
const wings = [...s.matchAll(/wing:t="([A-Za-z0-9_]+)"/g)].map(m => m[1]);
let badWings = wings.filter(w => !unitNames.includes(w));
badWings.length ? fail('wings without units: ' + [...new Set(badWings)].join(', ')) : ok('all ' + new Set(wings).size + ' wings have units');

// 8. squad members exist
const members = [...s.matchAll(/squad_members:t="([A-Za-z0-9_]+)"/g)].map(m => m[1]);
let badMembers = members.filter(m => !unitNames.includes(m));
badMembers.length ? fail('squad members without units: ' + [...new Set(badMembers)].join(', ')) : ok('all ' + new Set(members).size + ' squad members exist');

// 9. team split sanity
const a = (s.match(/team:t="A"/g) || []).length;
const b = (s.match(/team:t="B"/g) || []).length;
a === 2 && b === 2 ? ok('teams A/B: 2 respawns each') : fail(`teams A=${a} B=${b}`);

// 10. army for player_05..08
for (const n of ['player_05', 'player_06', 'player_07', 'player_08']) {
  const i = s.indexOf(`name:t="${n}"`);
  const seg = s.slice(i, i + 700);
  /army:i=2/.test(seg) ? ok(n + ' army=2') : fail(n + ' army != 2');
}
