# Monte Carlo-opcióárazó szimulátor

Árazz európai opciót Monte Carlóval: szimulálj lejáratkori árakat, és nézd, ahogy a becslés és konfidenciaintervalluma a Black–Scholes-árhoz tart.

## Az eszközről

A Monte Carlo-szimuláció úgy áraz egy opciót, hogy sok szimulált kimenetel diszkontált kifizetését átlagolja. Az eszköz kockázatsemleges geometriai Brown-mozgással szimulál lejárati részvényárakat, és megmutatja, ahogy a becslés és a konfidenciaintervalluma a pályák számának növelésével a Black–Scholes-árhoz konvergál.

## Gyakori kérdések

### Milyen gyorsan konvergál egy Monte Carlo-becslés?

A standard hiba 1/√N ütemben csökken: négyszer annyi szimuláció felezi a hibát.

### Minek Monte Carlo, ha a Black–Scholes-nak van képlete?

Itt a képlet a viszonyítási alap, amely igazolja a módszert. A Monte Carlo pályafüggő kifizetéseknél, sok alaptermék esetén és zárt képlet nélküli modelleknél válik nélkülözhetetlenné.

### Hogyan árazunk opciót Monte Carlo-szimulációval?

Sok lejáratkori részvényárat szimulálunk a kockázatsemleges mérték szerint, S_T = S₀ exp((r − ½σ²)T + σ√T Z), ahol Z standard normális, mindegyikre kiszámítjuk a kifizetést, átlagoljuk, és az átlagot a kockázatmentes kamatlábbal diszkontáljuk. A becslés a szimulációk számának növelésével a valódi árhoz tart.

### Mi a Monte Carlo-ár konfidenciaintervalluma?

A becslés ± 1,96 × standard hiba tartomány, ahol a standard hiba a diszkontált kifizetések mintabeli szórása osztva √N-nel. Az ilyen intervallumok nagyjából 95%-a tartalmazza a valódi árat, így az intervallumból látszik, hány szimuláció kell egy adott pontossághoz.

## Az elmélet

- [Monte Carlo-opcióárazás](https://quantsandbox.dev/hu/guide/stochastic/monte-carlo-pricing): Opcióárak becslése szimulációval: standard hiba, konfidenciaintervallum és konvergencia a Black–Scholes-árhoz.
- [Geometriai Brown-mozgás](https://quantsandbox.dev/hu/guide/derivatives/gbm): A részvényár standard modellje: lognormális eloszlás, várható érték és medián.
- [Projektkockázat: érzékenység, forgatókönyvek és Monte Carlo NPV](https://quantsandbox.dev/hu/guide/corporate/capital-budgeting-risk): Mely inputok mozgatják leginkább az NPV-t, fedezeti értékek, forgatókönyv-elemzés és az NPV szimulált eloszlása.
- [Véletlen bolyongás és Brown-mozgás](https://quantsandbox.dev/hu/guide/stochastic/random-walks): Pénzfeldobásos bolyongás, a variancia lineáris növekedése és a határeset: a Brown-mozgás.
- [A nagy számok törvénye és a centrális határeloszlás-tétel](https://quantsandbox.dev/hu/guide/stochastic/law-of-large-numbers-clt): Miért állnak be az átlagok, milyen gyorsan, és miért bukkan fel a normális eloszlás: a Monte Carlo és a Brown-határátmenet mögötti két tétel.
- [Kolmogorov-egyenletek és a Feynman–Kac-formula](https://quantsandbox.dev/hu/guide/stochastic/feynman-kac): A diffúzió generátora, a visszafelé egyenlet, és hogyan lesz egy várható érték egy PDE megoldása.
- [SDE-k szimulációja: az Euler–Maruyama-séma](https://quantsandbox.dev/hu/guide/stochastic/sde-simulation): Sztochasztikus differenciálegyenlet diszkretizálása, erős és gyenge hiba, lépésköz, és összevetés a geometriai Brown-mozgás pontos megoldásával.
- [Korrelált Brown-mozgások és többeszközös modellek](https://quantsandbox.dev/hu/guide/stochastic/correlated-brownian-motions): Korrelált Brown-mozgások Cholesky-faktorral, a kétdimenziós Itô-szabály, és hol lép be a korreláció a Heston-modellbe és a kosáropciók árazásába.
- [Ugrások és a Merton-féle ugró diffúzió](https://quantsandbox.dev/hu/guide/stochastic/jump-diffusion): Poisson-folyamat, összetett ugrások, a Merton-modell, és hogyan okoznak az ugrások vastag farkat és mosolyt.
- [Egzotikus opciók: korlátos, ázsiai és digitális opciók](https://quantsandbox.dev/hu/guide/derivatives/exotic-options): Útfüggő kifizetések, a kiütési korlát és az átlagár hatása, és miért természetes itt a Monte Carlo-árazás.

Az interaktív eszköz megnyitása: https://quantsandbox.dev/hu/monte-carlo
