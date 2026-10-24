# Brown-mozgás szimulátor drifttel és volatilitással

Szimuláld az aritmetikai Brown-mozgást: drift, volatilitás és reprodukálható mintapályák, az átlaggal és a szórással az idő függvényében.

## Az eszközről

A Brown-mozgás a pénzügyi modellek szívében álló folytonos idejű véletlen séta. A szimulátor aritmetikai Brown-mozgást rajzol választott drifttel és volatilitással, reprodukálható, maggal generált pályákkal, így látszik, hogy a drift adja a trendet, a volatilitás pedig az idővel növekvő szórást.

## Gyakori kérdések

### Mi a különbség a drift és a volatilitás között?

A μ drift az időegységenkénti átlagos változás, az átlagos pálya meredeksége. A σ volatilitás a véletlen részt skálázza; az átlag körüli szórás σ√t szerint nő.

### Lehet-e negatív az aritmetikai Brown-mozgás?

Igen. Az értéke normális eloszlású, így bármilyen valós értéket felvehet. Ezért modellezik a részvényárakat inkább geometriai Brown-mozgással.

### Mi a Brown-mozgás a pénzügyekben?

Folytonos idejű véletlen folyamat, amelynek nem átfedő intervallumokon vett változásai függetlenek és normális eloszlásúak, varianciájuk pedig arányos az intervallum hosszával. Az árak és kamatlábak kiszámíthatatlan részét modellezi; az aritmetikai Brown-mozgás, X_t = X₀ + μt + σW_t, ehhez állandó driftet ad.

### Miért ilyen szaggatottak a Brown-pályák?

Egy rövid Δt intervallumon a tipikus elmozdulás σ√Δt nagyságú, ami jóval nagyobb, mint maga Δt. Ezért a pálya nagyítva sem válik egyenessé: a Brown-mozgás folytonos, de sehol sem differenciálható.

## Az elmélet

- [Véletlen bolyongás és Brown-mozgás](https://quantsandbox.dev/hu/guide/stochastic/random-walks): Pénzfeldobásos bolyongás, a variancia lineáris növekedése és a határeset: a Brown-mozgás.
- [Az Itô-lemma](https://quantsandbox.dev/hu/guide/stochastic/ito-lemma): Kvadratikus variáció, láncszabály Brown-mozgásra és a logaritmikus ár −½σ² driftje.
- [Feltételes várható érték és martingálok](https://quantsandbox.dev/hu/guide/stochastic/martingales): Feltételes várható érték a múlt ismeretében, igazságos játékok, miért nem győzhető le egy martingál fogadási stratégiával, és a diszkontált árak Q alatt.
- [A Brown-mozgás tulajdonságai](https://quantsandbox.dev/hu/guide/stochastic/brownian-properties): Definíció, Gauss-folyamat jellemzés, skálázás, időinverzió, Markov-tulajdonság, kvadratikus variáció és a pályák szabálytalansága.
- [A Brown-híd](https://quantsandbox.dev/hu/guide/stochastic/brownian-bridge): Brown-mozgás rögzített végponttal: konstrukció, kovariancia, függetlenség és alkalmazások.
- [Az Itô-integrál](https://quantsandbox.dev/hu/guide/stochastic/ito-integral): Egyszerű integrandusok, Itô-izometria, martingál-tulajdonság és a ∫W dW = (W² − t)/2 levezetése.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/brownian-motion
