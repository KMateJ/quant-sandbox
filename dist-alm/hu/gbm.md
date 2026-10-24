# Geometriai Brown-mozgás (GBM) szimulátor

Szimuláld a geometriai Brown-mozgást, a Black–Scholes mögötti árfolyammodellt: drift, volatilitás, mintapályák és az elméleti várható érték.

## Az eszközről

A geometriai Brown-mozgás a részvényárak standard modellje és a Black–Scholes-modell alapja. Az árak véletlen százalékokkal változnak, nem véletlen összegekkel, ezért pozitívak maradnak és lognormális eloszlásúak. A szimulátor adott drift és volatilitás mellett mutat pályákat, az S₀e^{μt} elméleti várható értékkel együtt.

## Gyakori kérdések

### Miért GBM-mel modellezzük a részvényárakat?

Pozitívan tartja az árakat, és a hozamot teszi véletlenné, nem az árváltozást — ahogy egy részvény ugyanakkora eséllyel emelkedik 10%-ot 10-es és 100-as árszinten is.

### Miért van a tipikus pálya a várható érték alatt?

A lognormális eloszlás ferde: néhány nagyon magas kimenet felhúzza az átlagot, miközben a medián pálya csak μ − ½σ² ütemben nő.

### Mi a geometriai Brown-mozgás képlete?

Az ár a dS = μS dt + σS dW egyenletet követi, amelynek megoldása S_t = S₀ exp((μ − ½σ²)t + σW_t). A logaritmikus ár így normális eloszlású ln S₀ + (μ − ½σ²)t várható értékkel és σ²t varianciával, maga az ár pedig lognormális.

### Milyen hiányosságai vannak a GBM-nek mint árfolyammodellnek?

Állandó volatilitást és normális eloszlású loghozamokat feltételez. A valódi hozamok eloszlásának vastagabb a széle, vannak hirtelen ugrások, a volatilitás pedig időben változik és esésekkor megugrik. Ezért bővítik ki a sztochasztikus volatilitású modellek, például a Heston-modell, és az ugró diffúziós modellek.

## Az elmélet

- [Geometriai Brown-mozgás](https://quantsandbox.dev/hu/guide/derivatives/gbm): A részvényár standard modellje: lognormális eloszlás, várható érték és medián.
- [Hozamok és volatilitás](https://quantsandbox.dev/hu/guide/portfolio/returns-volatility): Egyszerű és logaritmikus hozam, szórás, évesítés és a négyzetgyök-szabály.
- [Mértékcsere és a Girsanov-tétel](https://quantsandbox.dev/hu/guide/stochastic/change-of-measure): Valószínűségek átsúlyozása sűrűséggel, ekvivalens mértékek, a Girsanov-tétel és a kockázat piaci ára.
- [Monte Carlo-opcióárazás](https://quantsandbox.dev/hu/guide/stochastic/monte-carlo-pricing): Opcióárak becslése szimulációval: standard hiba, konfidenciaintervallum és konvergencia a Black–Scholes-árhoz.
- [SDE-k szimulációja: az Euler–Maruyama-séma](https://quantsandbox.dev/hu/guide/stochastic/sde-simulation): Sztochasztikus differenciálegyenlet diszkretizálása, erős és gyenge hiba, lépésköz, és összevetés a geometriai Brown-mozgás pontos megoldásával.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/gbm
