# Kötvény durációja és konvexitása: közelítések

Hasonlítsd össze a kötvény pontos ár–hozam görbéjét a duráció- és a duráció + konvexitás közelítéssel, és lásd, hol romlik el mindkettő.

## Az eszközről

A duráció és a konvexitás azt közelíti, hogyan reagál egy kötvény ára a hozamváltozásra. Az eszköz összeveti a pontos ár–hozam görbét az elsőrendű durációegyenessel és a másodrendű duráció + konvexitás parabolával, így látszik, mekkora hozamsokkot bír el az egyes közelítés.

## Gyakori kérdések

### Mikor elég önmagában a duráció?

Kis hozamváltozásoknál. Nagyobb elmozdulásnál az ár–hozam kapcsolat görbülete miatt az egyenes durációbecslés alulbecsüli az árat, és a konvexitási tag jelentőssé válik.

### Miért értékes a pozitív konvexitás?

Pozitív konvexitásnál az ár jobban nő, ha a hozam csökken, mint amennyit esik, ha ugyanannyival nő. Azonos duráció mellett a konvexebb kötvény nagy kamatmozgásoknál jobban teljesít.

### Mi a különbség a Macaulay-féle és a módosított duráció között?

A Macaulay-duráció a pénzáramlások beérkezéséig hátralévő idő jelenértékkel súlyozott átlaga, években mérve. A módosított duráció ezt elosztja (1 + y/k)-val, ahol k az évenkénti kuponperiódusok száma, és megadja, hány százalékkal változik nagyjából az ár egy százalékpontos hozamváltozásra. A 7-es módosított duráció azt jelenti, hogy 1%-os hozamemelkedés körülbelül 7%-kal csökkenti az árat.

### Hogyan becsüljük meg egy kötvény árváltozását durációval és konvexitással?

ΔP / P ≈ −D_mod × Δy + ½ × C × (Δy)². Egy 7-es módosított durációjú és 60-as konvexitású kötvénynél egy százalékpontos hozamemelkedés (Δy = 0,01) nagyjából −7% + 0,3% = −6,7%-os árváltozást ad. A konvexitási tag a hozam mozgásának irányától függetlenül növeli a becslést.

## Az elmélet

- [Duráció és konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity): Macaulay- és módosított duráció, a kamatérzékenység lineáris és másodrendű közelítése.
- [Kötvényárak és hozamok](https://quantsandbox.dev/hu/guide/fixed-income/bond-pricing): Kötvény mint pénzáramlások sora, lejáratig számított hozam, par, prémium és diszkont.
- [Immunizáció és durációillesztés](https://quantsandbox.dev/hu/guide/fixed-income/immunization): Kötelezettség védelme kamatmozgások ellen jelenérték és duráció illesztésével, és miért számít a konvexitás és az újrasúlyozás.
- [Nem párhuzamos hozamgörbe-mozgások és kulcskamat-durációk](https://quantsandbox.dev/hu/guide/fixed-income/curve-risk): Párhuzamos eltolás, meredekedés és pillangó; a kulcskamat-durációk mint a kötvény érzékenysége a görbe egyes szakaszaira.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/duration-convexity
