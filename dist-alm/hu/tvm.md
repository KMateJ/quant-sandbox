# A pénz időértéke és kamatoskamat-kalkulátor

Egy kezdőtőke és rendszeres befizetések kamatos növekedése az idő során, a végső egyenleg felbontásával megszerzett kamatra és befizetett pénzre.

## Az eszközről

A pénz időértéke azt mondja ki, hogy ma egy egységnyi pénz többet ér, mint ugyanannyi később, mert kamatozhat. Ez a kamatoskamat-kalkulátor egy kezdőtőkét és rendszeres befizetéseket kamatoztat az idő múlásával, és a végső egyenleget felbontja a befizetett pénzre és a megszerzett kamatra.

## Gyakori kérdések

### Miért gyorsul a kamatos kamat növekedése az idővel?

A kamat nemcsak a tőke, hanem a korábban megszerzett kamat után is jár, így az egyenleg exponenciálisan nő, nem lineárisan.

### Mi a különbség a jelenérték és a jövőérték között?

A jövőérték egy összeget a kamatlábbal előre kamatoztat, a jelenérték egy jövőbeli összeget visszadiszkontál mára. Ugyanaz a számítás, ellentétes irányban.

### Hogyan számoljuk ki a kamatos kamatot?

Jövőérték = P × (1 + r/n)^(n·t), ahol P a kezdőtőke, r az éves kamatláb, n az évenkénti tőkésítések száma, t pedig az évek száma. Például 1000 évi 5%-on, éves tőkésítéssel 10 év alatt 1000 × 1,05¹⁰ ≈ 1628,89-re nő.

### Mi a 72-es szabály?

Gyors becslés a pénz megduplázódásának idejére: a 72-t elosztjuk a százalékban kifejezett kamatlábbal. Évi 6% mellett a pénz nagyjából 72 / 6 = 12 év alatt duplázódik meg; a pontos érték 11,9 év. A szabály nagyjából 4% és 12% közötti kamatlábaknál működik jól.

## Az elmélet

- [Kamat, kamatozás és diszkontálás](https://quantsandbox.dev/hu/guide/corporate/interest-discounting): Egyszerű, kamatos és folytonos kamatozás; jelenérték és diszkontfaktor.
- [Nettó jelenérték és belső megtérülési ráta](https://quantsandbox.dev/hu/guide/corporate/npv-irr): Projektpénzáramok, NPV, az NPV-profil, IRR, jövedelmezőségi index, és ahol az IRR félrevezet.
- [Annuitások, örökjáradékok és hiteltörlesztés](https://quantsandbox.dev/hu/guide/corporate/annuities): Egyenletes kifizetések jelenértéke, növekvő örökjáradék, hiteltörlesztő részlet és a törlesztési terv.
- [Reálkamat, infláció és inflációkövető kötvények](https://quantsandbox.dev/hu/guide/fixed-income/real-rates-inflation): A Fisher-összefüggés, nominális és reál diszkontálás, a kiegyenlítő (breakeven) infláció és az inflációkövető kötvény árazása.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/tvm
