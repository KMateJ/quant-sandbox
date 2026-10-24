# Monte Carlo-opcióárazás

Opcióárak becslése szimulációval: standard hiba, konfidenciaintervallum és konvergencia a Black–Scholes-árhoz.

A pénzügyekben sok mennyiség várható érték: egy opció ára a diszkontált várható kifizetés, egy kockázati mérőszám egy farokvalószínűség. Ha a várható értékre nincs zárt képlet, **Monte Carlo-szimulációval** becsülhető: sok véletlen kimenetelt sorsolunk, és átlagoljuk őket. Ez a lecke elmagyarázza, miért működik az átlagolás, milyen gyorsan konvergál, és hogyan árazható így egy európai call, felhasználva a részvényár pontos megoldását, amelyet „Az Itô-lemma” című lecke vezetett le.

## Várható érték mint hosszú távú átlag

Legyen $X$ egy valószínűségi változó, amelynek $\mathbb{E}[X]$ várható értékét keressük. Sorsoljunk $N$ független, azonos eloszlású példányt, $X_1, \dots, X_N$-et, és képezzük a **mintaátlagot**:

$$
\hat\mu_N = \frac{1}{N} \sum_{i=1}^{N} X_i.
$$

A **nagy számok törvénye** szerint $\hat\mu_N \to \mathbb{E}[X]$, ha $N \to \infty$. Ez a Monte Carlo módszer teljes alapötlete: egy nehezen kiszámolható integrált könnyen előállítható szimulált kimenetelek átlagával helyettesítünk.

A becslés **torzítatlan**: minden $N$-re $\mathbb{E}[\hat\mu_N] = \mathbb{E}[X]$. Egy-egy futás véletlen hibával tér el, de a hibának nincs szisztematikus iránya.

## A standard hiba

Legyen $s$ egyetlen $X_i$ sorsolás szórása. Mivel a sorsolások függetlenek, összegük varianciája $N s^2$, és $N$-nel osztva

$$
\operatorname{Var}(\hat\mu_N) = \frac{s^2}{N}, \qquad \operatorname{SE} = \operatorname{sd}(\hat\mu_N) = \frac{s}{\sqrt{N}}.
$$

Ez a becslés **standard hibája**. $1/\sqrt{N}$-ként csökken, ugyanazzal a négyzetgyökös törvénnyel, amely a „Véletlen bolyongás és Brown-mozgás” lecke bolyongását is irányította. A következmény kijózanító: a hiba tizedére csökkentéséhez százszor annyi szimuláció kell.

> Monte Carlo-hiba: $\operatorname{SE} = s/\sqrt{N}$. Egy további tizedesjegy pontosság százszor annyi sorsolásba kerül.

## Konfidenciaintervallum

A centrális határeloszlás-tétel szerint nagy $N$ esetén $\hat\mu_N$ közelítőleg normális eloszlású a valódi várható érték körül, $\operatorname{SE}$ szórással. A valódi $s$ ismeretlen, ezért a sorsolások mintabeli szórását használjuk helyette. Az $\mathbb{E}[X]$ közelítő **95%-os konfidenciaintervalluma**

$$
\hat\mu_N \pm 1{,}96\,\frac{s}{\sqrt{N}}.
$$

Ha a teljes kísérletet sokszor megismételnénk, az ilyen intervallumok kb. 95%-a tartalmazná a valódi várható értéket. Monte Carlo-becslést mindig az intervallumával együtt közölj: a becslés önmagában semmit sem mond arról, mennyire lehet megbízni benne.

## Egy európai call árazása

A „Kockázatsemleges valószínűségek” lecke megmutatta, hogy egy derivatíva ára a $\mathbb{Q}$ mérték szerinti diszkontált várható kifizetése. Egy $K$ kötési árú, $T$ lejáratú európai callra

$$
C_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\big[\max(S_T - K,\ 0)\big].
$$

$\mathbb{Q}$ alatt a részvény $r$ driftű GBM-et követ. Az Itô-lemma szerint a végső értéke pontosan ismert: $S_T = S_0 \exp((r - \tfrac12\sigma^2)T + \sigma W_T)$, ahol $W_T = \sqrt{T}\,Z$, $Z$ standard normális. Olyan kifizetésnél, amely csak $S_T$-től függ, nincs szükség időléptetésre. Az algoritmus:

1. Sorsolj $N$ független standard normális számot: $Z_1, \dots, Z_N$.
2. Számold ki a végső árakat: $S_T^{(i)} = S_0 \exp\big((r - \tfrac12\sigma^2)T + \sigma\sqrt{T}\,Z_i\big)$.
3. Számold ki a $\max(S_T^{(i)} - K, 0)$ kifizetéseket, és mindegyiket diszkontáld $e^{-rT}$-vel.
4. Átlagold a diszkontált kifizetéseket; mintabeli szórásuk $\sqrt{N}$-nel osztva a standard hiba.

Az ábra a szemünk előtt futtatja le ezt az algoritmust $S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$ és $T = 1$ mellett. Minden $S_T$-húzás egy végsőár-hisztogramba kerül; a kötési ár vonalától jobbra eső oszlopok színezettek, mert a call csak ott fizet. Nyomd meg néhányszor a +1 gombot, és figyeld az egyes húzásokat: a legtöbb 100 közelében landol, némelyik messze kint. Ezután az Indítás gombbal a húzások egyre gyorsabban érkeznek, a hisztogram felveszi a ferde lognormális alakot, az alatta lévő sáv pedig a futó becslést mutatja 95%-os sávjával együtt, amely a 10,45-ös Black–Scholes-ár körül szűkül. A kijelzők a húzások számát, a becslést, a standard hibát és a pénzben végző húzások arányát adják, ez utóbbi $N(d_2) \approx 0{,}56$ közelében állapodik meg. Az Újrakezdés új mintát indít.

*[Interaktív ábra: mc histogram](https://quantsandbox.dev/hu/guide/stochastic/monte-carlo-pricing)*

## Egy kis számpélda

Legyen $S_0 = 100$, $K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$. Ekkor $(r - \tfrac12\sigma^2)T = 0{,}03$ és $\sigma\sqrt{T} = 0{,}2$. Tegyük fel, hogy az öt sorsolás $Z = 0{,}5;\ -1{,}2;\ 1{,}5;\ 0{,}1;\ -0{,}3$. A végső árak $100\,e^{0{,}03 + 0{,}2Z}$:

- $Z = 0{,}5$: $S_T = 100\,e^{0{,}13} \approx 113{,}88$, kifizetés $13{,}88$.
- $Z = -1{,}2$: $S_T = 100\,e^{-0{,}21} \approx 81{,}06$, kifizetés $0$.
- $Z = 1{,}5$: $S_T = 100\,e^{0{,}33} \approx 139{,}10$, kifizetés $39{,}10$.
- $Z = 0{,}1$: $S_T = 100\,e^{0{,}05} \approx 105{,}13$, kifizetés $5{,}13$.
- $Z = -0{,}3$: $S_T = 100\,e^{-0{,}03} \approx 97{,}04$, kifizetés $0$.

Az átlagos kifizetés $58{,}11 / 5 \approx 11{,}62$, diszkontálva $11{,}62\,e^{-0{,}05} \approx 11{,}05$. Ezekre az adatokra a Black–Scholes-ár $10{,}45$. Öt sorsolás messze kevés: a becslés jó tartományban van, de a hibája nagy.

### Kidolgozott példa: Még egy húzás, lépésről lépésre

1. Ugyanazokkal a bemenetekkel ($S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$) vegyük a $Z = 0{,}8$ húzást. A lejárati ár.
   $$S_T = S_0\,e^{(r - \frac12\sigma^2)T + \sigma\sqrt{T}\,Z}$$ → **120.92**
2. A call kifizetése.
   $$(S_T - K)^+$$ → **20.92**
3. A diszkontált kifizetés: ennek a húzásnak a hozzájárulása az átlaghoz.
   $$e^{-rT}(S_T - K)^+$$ → **19.9**

## Összevetés a Black–Scholes-árral

Ezekre az adatokra egyetlen diszkontált kifizetés szórása kb. $s \approx 14{,}72$, nagyobb, mint maga az ár, mert az érték nagy része a pályák kisebb hányadából származik, amelyek mélyen pénzben végződnek. A standard hiba és a 95%-os intervallum fél szélessége így

- $N = 100$: $\operatorname{SE} \approx 1{,}47$, intervallum $\pm 2{,}89$.
- $N = 1000$: $\operatorname{SE} \approx 0{,}47$, intervallum $\pm 0{,}91$.
- $N = 5000$: $\operatorname{SE} \approx 0{,}21$, intervallum $\pm 0{,}41$.

Még 5000 pálya is csak kb. $\pm 0{,}41$ pontossággal határozza meg az árat a $10{,}45$-ös Black–Scholes-érték körül. $\sigma = 40\%$ mellett az ár kb. $18{,}02$-re, a kifizetés szórása kb. $31{,}29$-re nő, így az intervallum $N = 5000$-nél kb. $\pm 0{,}87$-re szélesedik: ingadozóbb kifizetéshez ugyanakkora pontossághoz több sorsolás kell.

Az ábra ezt a callt árazza ($S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$), a végső árakat pontosan a $\mathbb{Q}$ alatti GBM-ből sorsolva. A futó Monte Carlo-becslést ábrázolja a szimulációk számának függvényében 5000-ig, körülötte a $\pm 1{,}96\,\operatorname{SE}$ sávval, a Black–Scholes-árat pedig vízszintes egyenesként. Nyomd meg néhányszor az „Új minta” gombot: a görbe eleje ugrál, a sáv viszont $1/\sqrt{N}$-ként szűkül, és szinte mindig tartalmazza az egyenest. Mozgasd a $\sigma$ csúszkát, és figyeld meg, hogy a sáv szélesedik. Az $N = 5000$-nél mutatott kijelzők a becslést, a standard hibát, a Black–Scholes-árat és a hibát adják.

*[Interaktív ábra: monte carlo convergence](https://quantsandbox.dev/hu/guide/stochastic/monte-carlo-pricing)*

Európai callnál a zárt képlet nyilvánvalóan jobb. A Monte Carlo ott térül meg, ahol a kifizetés a teljes pályától függ (ázsiai vagy barrier opciók), ahol egyszerre sok alaptermék van, és olyan modelleknél, mint a Heston, ahol nincs egyszerű képlet. Az eljárás minden esetben ugyanaz; csak a kifizetésfüggvény változik.

## Varianciacsökkentés

Mivel a hiba $s/\sqrt{N}$, kétféleképpen javítható: $N$ növelésével vagy $s$ csökkentésével. Az $s$-t csökkentő eljárásokat **varianciacsökkentésnek** nevezzük. A legegyszerűbb az **antitetikus változók** módszere: minden $Z$ sorsolás mellett $-Z$-t is használjuk, és a két kifizetést átlagoljuk. A pár ellentétes irányba mozog, így zajuk nagy része kioltja egymást. Egy másik a **kontrollváltozó**: a szimuláció mellett egy pontosan ismert várható értékű mennyiséget is követünk, például a diszkontált részvényárat, amelynek várható értéke $S_0$, és a becslést az ebben a mennyiségben megfigyelt hibával korrigáljuk.

## Összefoglalás

- A Monte Carlo egy várható értéket $N$ független szimulált kimenetel átlagával becsül; a nagy számok törvénye biztosítja a konvergenciát.
- A standard hiba $s/\sqrt{N}$: a hiba felezéséhez négyszer annyi sorsolás kell.
- A 95%-os konfidenciaintervallum a becslés $\pm 1{,}96\,s/\sqrt{N}$.
- Egy európai call ára az $e^{-rT}\max(S_T - K, 0)$ átlaga az $S_T = S_0 e^{(r - \sigma^2/2)T + \sigma\sqrt{T}Z}$ kockázatsemleges sorsolásain; az eredmény a Black–Scholes-árhoz konvergál.
- Igazi ereje a rugalmasság: pályafüggő kifizetések és zárt képlet nélküli modellek.

> Monte Carlo-ár $= e^{-rT} \times$ átlagos kifizetés, az $s/\sqrt{N}$ standard hibával együtt közölve.

[Kövesd a Monte Carlo-becslés és konfidenciaintervallumának konvergenciáját a Monte Carlo laborban](https://quantsandbox.dev/hu/monte-carlo)

## Interaktív laborok

- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)
- [Geometriai Brown-mozgás (GBM) szimulátor](https://quantsandbox.dev/hu/gbm)

## Gyakorló kérdések

### 1. $N = 10\,000$ húzással egy árbecslés standard hibája $0{,}20$. Hány húzás kell a $0{,}05$-ös standard hibához?

**Válasz:** 160000

A standard hiba $1/\sqrt{N}$ szerint csökken. A negyedére csökkentéshez $4^2 = 16$-szor annyi húzás kell: $160\,000$.

### 2. Egy Monte Carlo-becslés $10{,}40$, a standard hibája $0{,}15$. Mennyi a 95%-os konfidenciaintervallum felső végpontja?

**Válasz:** 10.694

$10{,}40 + 1{,}96 \cdot 0{,}15 = 10{,}694$; az intervallum $[10{,}106;\ 10{,}694]$.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/monte-carlo-pricing

Előző lecke: [Mértékcsere és a Girsanov-tétel](https://quantsandbox.dev/hu/guide/stochastic/change-of-measure)

Következő lecke: [SDE-k szimulációja: az Euler–Maruyama-séma](https://quantsandbox.dev/hu/guide/stochastic/sde-simulation)
