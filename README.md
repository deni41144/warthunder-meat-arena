# 🍖 Мясо-Арена для War Thunder

Кастомные юзер-миссии на двоих: **мгновенная перезарядка, бесконечные патроны,
×5 тяга самолётов, без слива тикетов**. Собраны из реальных рабочих миссий с WT Live.

> ⚠️ Поправка к моему первому ответу: я говорил, что «статы миссия не крутит».
> Это было неверно. В юзер-миссиях есть `unitRestore` и `unitSetProperties`,
> которыми перезарядка и тяга двигателя реально меняются. Ниже — как именно.

---

## 1. Что внутри

| Файл | Что это |
|---|---|
| `missions/usr_fun_arena_air.mission.blk` | **Воздушная арена.** Синай, 32 слота (16×16), мгновенная перезарядка, бесконечные патроны, тяга ×5, тикеты отключены. |
| `missions/usr_fun_arena_ground.mission.blk` | **Наземная арена.** Синай, 8 слотов (4×4), хорда AI-ботов, мгновенная перезарядка, тикеты отключены. |
| `ref/` | Три исходные миссии с WT Live — можно запускать как есть. |
| `tools/` | Скрипты сборки (видно, что и как патчилось). |

---

## 2. Как это сделано (честная механика)

### Мгновенная перезарядка / бесконечные патроны
Триггер на `periodicEvent` каждые **0.1 с** дёргает `unitRestore` с `ammoRestore:b=yes`
для всех слотов игроков:

```
instant_reload{
  events{ periodicEvent{ time:r=0.1 } }
  actions{
    unitRestore{
      ressurectIfDead:b=no
      fullRestore:b=no
      target:t="player_01"
      ...
      ammoRestore:b=yes
    }
  }
}
```

Игра считает это пополнением БК и сбрасывает цикл заряжания — на практике танк
стреляет несколько раз в секунду. Так сделано в миссии
[«Sinai with insta reload and no ticket bleed»](https://live.warthunder.com/post/1192881/en/).

### Тяга самолётов ×5
Отдельный триггер на `initMission`:

```
thrust_multiplier{
  events{ initMission{} }
  actions{
    unitSetProperties{
      object:t="BluePlayer01"
      ...
      plane{ thrust_mult:r=5 }
    }
  }
}
```

Так сделана миссия
[«10x engine power»](https://live.warthunder.com/post/1192866/en/) — там ровно `thrust_mult:r=10`.

### Без слива тикетов
В `mission_settings.mission`:
```
gt_mp_tickets:b=no
scoreLimit:i=999999999
```

---

## 3. Установка

1. Папка игры: Steam → `...\steamapps\common\War Thunder`, лончер → `C:\Program Files (x86)\War Thunder`.
2. Скопируй `.blk` в `<папка игры>\UserMissions\`.
3. Игра → **Custom Battles** → **User Missions** → выбери миссию.

## 4. Игра с кентом онлайн

По оф. вики нужны: инициатор с покупкой **> $10** (у тебя есть), миссия на дефолтной
локации (Синай — да), респавн-зоны обеих команд (есть).

1. Залей `.blk` в публичное место с прямой ссылкой (GitHub Raw / gist / WT Live).
2. В игре: Custom Battles → **Create Session** → **Missions by URL** →
   отметь ссылку **favorite** → **Add mission** → вставь URL.
3. Пароль на лобби, `Include bots` выключить (свои боты уже в миссии).
4. Кент заходит в твой сеанс.

> Если URL не принимается — попробуй без `https://`.

---

## 5. Крутилки (что менять под себя)

| Хочу | Где | Значение |
|---|---|---|
| Ещё быстрее тяга | `thrust_multiplier` → `thrust_mult:r=5` | ставь `10` |
| Выключить буст тяги | там же | `thrust_mult:r=1` |
| Перезарядка реже/чаще | `instant_reload` → `periodicEvent{ time:r=0.1 }` | `0.05` — злее, `0.5` — спокойнее |
| Больше ботов | ground → `count:i=24` и `value:i=24` | `40` |
| Другая карта | `level:t="..."` | только через CDK Mission Editor |

---

## 6. Ограничения (без сказок)

- **Скорость танков** отдельным множителем не задаётся — в CDK есть `thrust_mult`
  только для авиации. Танкам достаётся перезарядка и патроны.
- **32 слота** в воздушной миссии — это лимит слотов, а не 32 живых игрока;
  вдвоём всё работает.
- Миссии из `ref/` — чужие, не мои; лицензии/авторство у их создателей.

---

## 7. Проверка

- Обе миссии: скобки сбалансированы, все ссылки на юниты/зоны сходятся
  (`tools/` + прогон проверок).
- Собраны из **реально работающих** миссий WT Live, а не с нуля.
- **В игре не запускал** — клиента тут нет. Первый запуск за тобой.

### Источники
- [Infinite ammo / fast-firing (Poland)](https://live.warthunder.com/post/718418/en/)
- [Sinai insta reload, no ticket bleed](https://live.warthunder.com/post/1192881/en/)
- [Nuclear thunder: 10x engine power, insta reload](https://live.warthunder.com/post/1192866/en/)
- [CDK: unitSetProperties (полный список полей)](https://wikiwiki.jp/wtcdk/unitSetProperties)
- [CDK: запуск кастомной миссии](https://wiki.warthunder.com/cdk/launch_custom_mission)
