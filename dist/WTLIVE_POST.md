# WT Live — готовый пост

## Куда жать

1. Открой https://live.warthunder.com/ → войди под своим аккаунтом.
2. **Add** (справа сверху) → **Mission**.
3. Заполни поля ниже, прикрепи файл `meat-arena-wtlive.zip` из папки `dist/`.
4. **Publish**.

> Если WT Live не принимает zip — загрузи два `.blk` отдельными постами
> (текст ниже подходит для каждого, поменяй только заголовок).

---

## Заголовок (Title)

```
MEAT ARENA - Sinai | instant reload, infinite ammo, x10 thrust
```

---

## Описание (Description) — копируй как есть

```
#warthunder #live_wt #workshop

Two custom multiplayer missions on Sinai for absolute chaos with friends.
No ticket bleed, no ammo limits, no waiting for reload.

WHAT'S INSIDE
- usr_fun_arena_air.mission.blk  - 32 slots (16v16), aircraft only.
- usr_fun_arena_ground.mission.blk - 8 slots (4v4) + 40 AI bots as meat.

MODIFIERS
- Instant reload / infinite ammo: unitRestore (ammoRestore) fires every 0.05 s
  for every player slot. Tanks can fire several shells per second.
- Aircraft engine thrust x10: unitSetProperties (plane > thrust_mult).
- No ticket bleed: gt_mp_tickets=no, score limit 999999999.

HOW TO PLAY
1. Download the archive and put the .blk files into <War Thunder>/UserMissions/.
2. In game: Custom Battles -> User Missions -> pick a mission.
3. To play with friends online: Custom Battles -> Create Session ->
   "Missions by URL" -> mark the link as favorite -> Add mission -> paste
   a direct .blk URL. Host needs any store purchase above $10.

RAW LINKS (for "Missions by URL")
https://raw.githubusercontent.com/deni41144/warthunder-meat-arena/main/missions/usr_fun_arena_air.mission.blk
https://raw.githubusercontent.com/deni41144/warthunder-meat-arena/main/missions/usr_fun_arena_ground.mission.blk

TUNING
- thrust_mult:r=10 -> change to 1 to disable, 20 for insanity.
- periodicEvent time:r=0.05 -> lower is faster reload.
- count:i=40 / value:i=40 -> number of AI bots.

Made for fun with a friend. Have fun and don't break your mouse.
```

---

## Теги (если WT Live спросит)

```
warthunder, live_wt, workshop, mission, multiplayer, sinai, fun
```

---

## После публикации

- В посте появится **Copy mission link** — это ссылка на страницу поста,
  для `Missions by URL` лучше брать **Raw**-ссылку из описания выше.
- Закрепи ссылку себе, чтобы не искать.
