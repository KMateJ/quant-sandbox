# Kötvényárazó kalkulátor és ár–hozam görbe

Értékelj kötvényt a pénzáramlásaiból: diszkontálás jelenértékre, ár, duráció, konvexitás és húzható ár–hozam görbe.

## Az eszközről

Egy kötvény ára a kuponjainak és a névértékének a hozammal diszkontált jelenértéke. Ez a kötvényárazó munkafelület kirajzolja a pénzáramlások idővonalát, diszkontálja az egyes kifizetéseket, és egy húzható ár–hozam görbén összeköti az árat a durációval és a konvexitással.

## Gyakori kérdések

### Miért esik a kötvényár, ha a hozam nő?

A pénzáramlások rögzítettek, így magasabb diszkontráta mellett mindegyik kevesebbet ér ma. Minél távolabbi egy kifizetés, annál erősebb a hatás.

### Mi a különbség a duráció és a konvexitás között?

A duráció az ár–hozam görbe meredeksége: kis hozamváltozásra a közelítő százalékos árváltozás. A konvexitás azt a görbületet méri, amelyet az egyenes durációbecslés nem lát.

### Hogyan számoljuk ki egy kötvény árát?

Minden pénzáramlást diszkontálunk a hozammal, majd összeadjuk őket: ár = Σ C / (1 + y)^t + F / (1 + y)^T. Például egy 100-as névértékű, 3 éves, évi 5%-os kupont fizető kötvény 4%-os hozam mellett 5/1,04 + 5/1,04² + 105/1,04³ ≈ 102,78-at ér.

### Mi a különbség a kuponráta és a lejáratig számított hozam között?

A kuponráta a névérték százalékában rögzíti a kifizetéseket. A lejáratig számított hozam az az egyetlen diszkontráta, amellyel a hátralévő kifizetések jelenértéke éppen a piaci árral egyezik meg. Ha a kötvény névérték alatt forog, a hozama magasabb a kuponrátánál; névérték felett alacsonyabb.

## Az elmélet

- [Kötvényárak és hozamok](https://quantsandbox.dev/hu/guide/fixed-income/bond-pricing): Kötvény mint pénzáramlások sora, lejáratig számított hozam, par, prémium és diszkont.
- [Duráció és konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity): Macaulay- és módosított duráció, a kamatérzékenység lineáris és másodrendű közelítése.
- [Immunizáció és durációillesztés](https://quantsandbox.dev/hu/guide/fixed-income/immunization): Kötelezettség védelme kamatmozgások ellen jelenérték és duráció illesztésével, és miért számít a konvexitás és az újrasúlyozás.
- [Visszahívható kötvények és negatív konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/callable-bonds): A kibocsátó visszahívási opciója, az ár összenyomódása a visszahívási ár közelében, a visszahívásig számított hozam és a negatív konvexitás.
- [Hitelkockázat: csődvalószínűség és hitelfelár](https://quantsandbox.dev/hu/guide/fixed-income/credit-risk): Csődintenzitás, túlélési valószínűség, megtérülési ráta, kockázatos kötvények árazása és a CDS-felár.
- [Reálkamat, infláció és inflációkövető kötvények](https://quantsandbox.dev/hu/guide/fixed-income/real-rates-inflation): A Fisher-összefüggés, nominális és reál diszkontálás, a kiegyenlítő (breakeven) infláció és az inflációkövető kötvény árazása.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/bond-pricing
