# Hatékony front és Markowitz-optimalizálás

Markowitz-féle átlag–variancia optimalizálás: hatékony front, minimális varianciájú és maximális Sharpe-mutatójú portfólió, célhozam vagy célvolatilitás.

## Az eszközről

A Markowitz-féle portfólióoptimalizálás minden kockázati szinthez a legmagasabb várható hozamú portfóliót keresi meg: ez a hatékony front. Az eszköz kiszámolja a globális minimális varianciájú portfóliót, a maximális Sharpe-mutatójú érintési portfóliót, valamint a cél-hozamú vagy cél-volatilitású portfóliókat, és megmutatja, mennyi hatékonyságba kerülnek a súlykorlátok, például a shortolás tilalma.

## Gyakori kérdések

### Mi az érintési portfólió?

A hatékony front legmagasabb Sharpe-mutatójú portfóliója. A kockázatmentes kamatlábból hozzá húzott egyenes a lehető legmeredekebb tőkeallokációs egyenes.

### Miért számítanak a korlátok?

Az olyan korlátok, mint a shortolás tilalma, szűkítik a megengedett portfóliók körét, így a korlátozott front a korlátozatlanon vagy alatta fut. A kettő közötti rés a korlát ára.

### Mi a hatékony front?

Azoknak a portfólióknak a halmaza, amelyek minden volatilitási szinten a legmagasabb várható hozamot adják, vagy ami ugyanaz, minden várható hozamhoz a legkisebb volatilitást. Az összes lehetséges portfólió tartományának felső széle, amely a globális minimális varianciájú portfólióból indul. Az alatta fekvő portfólió nem hatékony, mert van másik, amely ugyanakkora kockázat mellett több hozamot kínál.

### Miért változnak ennyire az optimális portfóliósúlyok a bemenetekkel?

Az átlag–variancia optimalizáláshoz minden eszköz várható hozama, volatilitása és korrelációi kellenek. A becsült várható hozamok zajosak, az optimalizáló pedig erősen ráhajt a legjobbnak látszó eszközökre, így a bemenetek kis változása is nagyot mozdíthat a súlyokon. Az olyan korlátok, mint a shortolási tilalom vagy a pozíciólimitek, stabilabbá teszik a súlyokat.

## Az elmélet

- [Hatékony front és tőkepiaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/efficient-frontier): Átlag–variancia optimalizálás, minimális varianciájú portfólió, kockázatmentes eszköz és az érintőportfólió.
- [Diverzifikáció és korreláció](https://quantsandbox.dev/hu/guide/portfolio/diversification): Két eszköz portfóliója, a kovariancia szerepe, és miért csökken a kockázat a korrelációval.
- [CAPM, béta és az értékpapír-piaci egyenes](https://quantsandbox.dev/hu/guide/portfolio/capm): Szisztematikus és egyedi kockázat, a béta mint piaci érzékenység, várható hozam és alfa.
- [Kockázatkerülés és az optimális teljes portfólió](https://quantsandbox.dev/hu/guide/portfolio/risk-aversion): Várható érték–variancia hasznosság, közömbösségi görbék, a kockázatkerülési együttható és a tőkeallokációs egyenes legjobb pontja.
- [Portfóliókorlátok és a shortolás nélküli hatékony front](https://quantsandbox.dev/hu/guide/portfolio/portfolio-constraints): Miért nem követheti egy valódi portfólió a korlátozatlan frontot: shortolási tilalom, pozíciólimitek, és mennyit vesznek el a Sharpe-mutatóból.
- [A várható hozam és a kovariancia becslése](https://quantsandbox.dev/hu/guide/portfolio/input-estimation): Mintamomentumok, standard hibáik, miért instabil a hatékony front, és a zsugorítás (shrinkage) mint ellenszer.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/efficient-frontier
