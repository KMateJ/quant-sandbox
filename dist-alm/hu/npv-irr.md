# NPV- és IRR-kalkulátor NPV-profillal

Tőkeköltségvetés vizuálisan: nettó jelenérték, belső megtérülési ráta, jövedelmezőségi index és az NPV-profil a diszkontráta függvényében.

## Az eszközről

A nettó jelenérték és a belső megtérülési ráta a beruházási döntések alapeszközei. Add meg egy projekt pénzáramlásait, és megkapod az NPV-t egy választott diszkontrátán, az IRR-t, a jövedelmezőségi indexet és az NPV-profilt, amely mutatja, hogyan változik az érték a diszkontrátával.

## Gyakori kérdések

### Mi a különbség az NPV és az IRR között?

Az NPV az az érték, amit a projekt adott diszkontráta mellett ma hozzáad. Az IRR az a diszkontráta, amelynél az NPV nulla. Egy projekt akkor fogadható el, ha az NPV pozitív — hagyományos pénzáramlásoknál ezzel egyenértékű, hogy az IRR meghaladja a tőkeköltséget.

### Mikor mondhat mást az NPV és az IRR?

Eltérő méretű vagy időzítésű, egymást kizáró projektek rangsorolásánál, illetve ha a pénzáramlások többször előjelet váltanak, ami több IRR-t is adhat. Az NPV a megbízhatóbb kritérium.

### Hogyan számoljuk ki a nettó jelenértéket (NPV)?

Minden pénzáramlást a mai napra diszkontálunk, majd összeadjuk őket: NPV = Σ CF_t / (1 + r)^t, ahol a kezdő befektetés negatív CF₀. Például ha most 1000-et fektetünk be, és a következő két évben évente 600-at kapunk, 10%-os diszkontrátával NPV = −1000 + 545,45 + 495,87 ≈ 41,32, vagyis a projekt értéket teremt.

### Mi a jövedelmezőségi index?

A jövőbeli pénzáramlások jelenértéke osztva a kezdő befektetéssel. Az 1 feletti érték pozitív NPV-t jelent. Korlátozott tőke mellett segít rangsorolni a projekteket, mert megmutatja az egységnyi befektetésre jutó teremtett értéket: ha egy 1000-es befektetés jövőbeli pénzáramlásai ma 1041-et érnek, az index körülbelül 1,04.

## Az elmélet

- [Nettó jelenérték és belső megtérülési ráta](https://quantsandbox.dev/hu/guide/corporate/npv-irr): Projektpénzáramok, NPV, az NPV-profil, IRR, jövedelmezőségi index, és ahol az IRR félrevezet.
- [Kamat, kamatozás és diszkontálás](https://quantsandbox.dev/hu/guide/corporate/interest-discounting): Egyszerű, kamatos és folytonos kamatozás; jelenérték és diszkontfaktor.
- [Projektkockázat: érzékenység, forgatókönyvek és Monte Carlo NPV](https://quantsandbox.dev/hu/guide/corporate/capital-budgeting-risk): Mely inputok mozgatják leginkább az NPV-t, fedezeti értékek, forgatókönyv-elemzés és az NPV szimulált eloszlása.
- [Reálopciók: a rugalmasság értéke](https://quantsandbox.dev/hu/guide/corporate/real-options): A várakozás, bővítés és kilépés lehetősége mint opció, értékelése binomiális fán, és a bővített NPV.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/npv-irr
