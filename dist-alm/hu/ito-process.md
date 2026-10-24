# Itô-lemma vizualizáció: a −½σ² driftkorrekció

Nézd az Itô-lemmát a logaritmikus árakon: miért μ − ½σ² a geometriai Brown-mozgás logaritmusának driftje μ helyett.

## Az eszközről

Az Itô-lemma a sztochasztikus analízis láncszabálya. A geometriai Brown-mozgás logaritmusára alkalmazva megmutatja, hogy a logár driftje μ − ½σ², nem μ. A vizualizáció láthatóvá teszi ezt a −½σ²-es korrekciót, és megmagyarázza az eredetét: a Brown-mozgás kvadratikus variációját.

## Gyakori kérdések

### Miért van az Itô-lemmában egy extra tag?

A Brown-növekmények √dt nagyságrendűek, így (dW)² úgy viselkedik, mint dt, és nem tűnik el. A ½f″σ²dt másodrendű Taylor-tag ezért megmarad, a közönséges analízissel ellentétben.

### Mit jelent a −½σ² tag a gyakorlatban?

Ez a rés a μ számtani átlaghozam és egy tipikus pálya növekedési üteme között. Nagyobb volatilitás változatlan átlaghozam mellett is csökkenti egyetlen befektetés hosszú távú növekedését.

### Mi az Itô-folyamat?

dX = a(t, X) dt + b(t, X) dW alakú folyamat: egy drifttag és egy Brown-mozgás által hajtott tag összege. A drifttel rendelkező Brown-mozgás, a geometriai Brown-mozgás és az átlaghoz visszahúzó kamatlábmodellek mind Itô-folyamatok, az Itô-lemma pedig megmondja, hogyan változik ezek bármely sima függvénye.

### Hogyan alkalmazzuk az Itô-lemmát ln S-re?

Az f(S) = ln S függvényre f′ = 1/S és f″ = −1/S². Ha dS = μS dt + σS dW, az Itô-lemma szerint d(ln S) = (μ − ½σ²) dt + σ dW, vagyis a logaritmikus ár μ − ½σ² driftű Brown-mozgás.

## Az elmélet

- [Az Itô-lemma](https://quantsandbox.dev/hu/guide/stochastic/ito-lemma): Kvadratikus variáció, láncszabály Brown-mozgásra és a logaritmikus ár −½σ² driftje.
- [Véletlen bolyongás és Brown-mozgás](https://quantsandbox.dev/hu/guide/stochastic/random-walks): Pénzfeldobásos bolyongás, a variancia lineáris növekedése és a határeset: a Brown-mozgás.
- [Az Itô-integrál](https://quantsandbox.dev/hu/guide/stochastic/ito-integral): Egyszerű integrandusok, Itô-izometria, martingál-tulajdonság és a ∫W dW = (W² − t)/2 levezetése.
- [Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek](https://quantsandbox.dev/hu/guide/stochastic/mean-reversion): Hosszú távú szinthez húzott folyamat, egzakt megoldása és stacionárius eloszlása, valamint a rövid kamat a Vasicek-modellben.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/ito-process
