# Az egylépéses binomiális modell

A részvény fel- vagy lemegy; a call replikálása részvényből és kötvényből.

Ez a lecke azt a legegyszerűbb modellt építi fel, amelyben egy opciónak egyértelmű ára van. A „Határidős ügyletek, call és put opciók” lecke kifizetéseire és az „Arbitrázs és a határidős ár” lecke replikációs érvére épít: ha forgalmazott termékekből álló portfólió pontosan azt fizeti, amit az opció, akkor az opció ára a portfólió árával egyezik meg. Most ezt a portfóliót konkrétan előállítjuk.

## A modell

Egyetlen periódus van, a mai naptól (0. időpont) egy jövőbeli időpontig (1. időpont), és két forgalmazott termék:

- Egy **részvény**, amelynek mai ára $S_0$. Az 1. időpontban értéke vagy $uS_0$ (felfelé állapot), vagy $dS_0$ (lefelé állapot), ahol $d < u$. Az $u$ és $d$ számok a **felfelé** és **lefelé szorzó**.
- Egy **kockázatmentes kötvény** (vagy bankszámla). A ma befektetett egy egység az 1. időpontban mindkét állapotban $1+r$-et ér. Az egylépéses leckékben $r$ a teljes periódusra vonatkozó egyszerű kamatláb, így a pénz $(1+r)$-szeresére nő, nem $e^{rT}$-szeresére.

Feltesszük továbbá, hogy mindkét termékből tetszőleges (akár tört) mennyiséget lehet venni vagy shortolni, nincs tranzakciós költség és osztalék, és ugyanazon az $r$ kamaton lehet hitelt felvenni és betétet elhelyezni.

A modell semmit nem mond arról, mennyire valószínű a felfelé állapot. Létezik egy valós $p$ valószínűség, de mint látni fogjuk, az opció ára nem használja.

## Az arbitrázsmentességi feltétel

A modell csak akkor értelmes, ha egyik termék sem jobb a másiknál minden állapotban. Ha $1+r \ge u$, a kötvény minden állapotban legalább annyit fizet, mint a részvény, így a részvény shortolása és kötvény vásárlása arbitrázs. Ha $1+r \le d$, a részvény minden állapotban veri a kötvényt, és hitelből részvényt venni arbitrázs. Ezért megköveteljük, hogy

$$
d < 1 + r < u.
$$

Szavakkal: a kockázatmentes növekedési szorzó szigorúan a részvény két lehetséges szorzója közé esik.

## Az opció kifizetése a két csúcsban

Vegyünk egy európai callt $K$ kötési árral és 1. időpontbeli lejárattal. Az 1. időpontban az értéke az adott állapotbeli kifizetés:

$$
C_u = (uS_0 - K)^+, \qquad C_d = (dS_0 - K)^+.
$$

Ebben semmi sem jellemző kifejezetten a callra. Minden olyan $X$ kifizetést, amely csak az 1. időpontbeli részvényártól függ, két szám ír le, $X_u$ és $X_d$, és a lecke további része minden ilyen kifizetésre érvényes.

## A replikáló portfólió

Vegyünk $\Delta$ darab részvényt, és tegyünk $B$ összeget a kötvénybe ($B < 0$ hitelfelvételt jelent). Ez ma $\Delta S_0 + B$-be kerül. Az 1. időpontban az értéke felfelé állapotban $\Delta uS_0 + B(1+r)$, lefelé állapotban $\Delta dS_0 + B(1+r)$. Azt akarjuk, hogy ezek egyezzenek az opció értékeivel:

$$
\begin{aligned} \Delta\,uS_0 + B(1+r) &= C_u, \\ \Delta\,dS_0 + B(1+r) &= C_d. \end{aligned}
$$

Két lineáris egyenlet, két ismeretlen. Az elsőből kivonva a másodikat $B$ kiesik:

$$
\Delta = \frac{C_u - C_d}{uS_0 - dS_0}.
$$

$\Delta$ tehát az opció értékének változása osztva a részvényár változásával a két állapot között. A lefelé állapot egyenletébe visszahelyettesítve megkapjuk a kötvénypozíciót:

$$
B = \frac{C_d - \Delta\,dS_0}{1+r} = \frac{uC_d - dC_u}{(u-d)(1+r)}.
$$

Callnál $C_u \ge C_d$, ezért $0 \le \Delta \le 1$ és $B \le 0$: a replikáló portfólió egy részvény töredékét tartja, részben hitelből finanszírozva.

## Az ár a replikáció költsége

A portfólió és a call az 1. időpontban mindkét állapotban ugyanannyit ér. Ha ma eltérne az áruk, megvehetnénk az olcsóbbat, eladhatnánk a drágábbat, és kockázat nélkül megtarthatnánk a különbséget. Ez arbitrázs, ezért az egy ár törvénye kikényszeríti, hogy

$$
C_0 = \Delta S_0 + B.
$$

> Az egylépéses binomiális modellben az opció ára annak a részvényből és kötvényből álló portfóliónak a mai költsége, amely mindkét állapotban reprodukálja a kifizetését. Ebben az érvelésben sem valószínűségek, sem kockázati attitűdök nem szerepelnek.

## Kidolgozott példa

Legyen $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$, periódusonként $r = 2\%$ és $K = 100$. A $0{,}9 < 1{,}02 < 1{,}2$ feltétel teljesül.

1. Részvény az 1. időpontban: $uS_0 = 120$ vagy $dS_0 = 90$.
2. Call az 1. időpontban: $C_u = (120 - 100)^+ = 20$ és $C_d = (90 - 100)^+ = 0$.
3. Részvények száma: $\Delta = \dfrac{20 - 0}{120 - 90} = \dfrac{2}{3} \approx 0{,}6667$.
4. Kötvény: $B = \dfrac{0 - \tfrac{2}{3}\cdot 90}{1{,}02} = -\dfrac{60}{1{,}02} \approx -58{,}82$, vagyis 58,82 hitel.
5. Ár: $C_0 = \tfrac{2}{3}\cdot 100 - 58{,}82 \approx 66{,}67 - 58{,}82 = 7{,}84$.

Ellenőrzés: felfelé állapotban a portfólió értéke $\tfrac{2}{3}\cdot 120 - 60 = 20$, lefelé $\tfrac{2}{3}\cdot 90 - 60 = 0$. A hitel visszafizetése mindkét állapotban $58{,}82 \cdot 1{,}02 = 60$. A portfólió kifizetése tehát pontosan megegyezik a calléval.

Ha a call 9-en forogna, eladnánk, 7,84-ért felépítenénk a portfóliót, és ma megtartanánk 1,16-ot. Az 1. időpontban a portfólió pontosan annyit fizet, amennyivel a call miatt tartozunk, bármelyik állapot következik be.

### Kidolgozott példa: Egy call replikálása $u = 1{,}2$ és $d = 0{,}8$ mellett

1. Legyen $S_0 = 100$, $u = 1{,}2$, $d = 0{,}8$, $r = 2\%$ és $K = 100$, így $C_u = 20$ és $C_d = 0$. A részvénypozíció
   $$\Delta = \frac{20 - 0}{120 - 80}$$ → **0.5**
2. A kötvénypozíció a lefelé állapot egyenletéből: ez hitel.
   $$B = \frac{0 - 0{,}5 \cdot 80}{1{,}02}$$ → **-39.22**
3. A call annyiba kerül, mint a portfólió.
   $$C_0 = 0{,}5 \cdot 100 - 39{,}22$$ → **10.78**
4. Ellenőrzés felfelé állapotban: fél részvény 60-at ér, ebből levonjuk a 40-es hiteltörlesztést.
   $$0{,}5 \cdot 120 - 39{,}22 \cdot 1{,}02$$ → **20**

## A fa vizsgálata

Az ábra felrajzolja az egylépéses fát, minden csúcsban a részvényárral és a call értékével, és kiírja $\Delta$-t, $B$-t és a call árát. Változtasd $u$-t, $d$-t, $r$-t és $K$-t. A $K$ növelése csökkenti $C_u$-t, így $\Delta$-t és az árat is; ha $u$ és $d$ távolabb kerül egymástól, nő az ár. Ha $r$, $u$ vagy $d$ mozgatásával $1+r$ kikerül a $(d, u)$ intervallumból, az ábra jelzi, hogy az arbitrázsmentességi feltétel sérül. A kiírt $q$ értékkel a következő lecke foglalkozik.

*[Interaktív ábra: one step tree](https://quantsandbox.dev/hu/guide/derivatives/one-step-binomial)*

## Összefoglalás

- Az egylépéses modellben a részvény $uS_0$-ra vagy $dS_0$-ra lép, a kötvény $1+r$-szeresére nő, és az arbitrázs kizárásához $d < 1+r < u$ kell.
- Bármely 1. időpontbeli kifizetést $\Delta = (C_u - C_d)/(uS_0 - dS_0)$ részvény és $B = (C_d - \Delta dS_0)/(1+r)$ kötvény replikál.
- Az egy ár törvénye miatt az opció ára $C_0 = \Delta S_0 + B$.
- A felfelé lépés valós valószínűsége sehol nem jelenik meg az árban.

> A „Kockázatsemleges valószínűségek” lecke a $\Delta S_0 + B$ árat $C_u$ és $C_d$ diszkontált súlyozott átlagaként írja fel; ez a forma öröklődik minden későbbi árazási modellbe.

[Építs és árazz binomiális fákat a Binomiális laborban](https://quantsandbox.dev/hu/binomial)

## Interaktív laborok

- [Binomiális opcióárazó fa kalkulátor](https://quantsandbox.dev/hu/binomial)

## Gyakorló kérdések

### 1. Egy egylépéses modellben $S_0 = 100$, $u = 1{,}2$ és $d = 0{,}8$. Hány részvény ($\Delta$) replikál egy $K = 100$ kötési árú callt?

**Válasz:** 0.5

$C_u = 20$ és $C_d = 0$, így $\Delta = (20 - 0)/(120 - 80) = 0{,}5$.

### 2. A callt replikáló portfólióban milyen a $B$ kötvénypozíció?

- a) Negatív: a részvények egy részét hitelből vesszük
- b) Pozitív: pénzt helyezünk el $r$ kamaton
- c) Nulla: a részvények egyedül replikálják a callt
- d) A felfelé lépés valós valószínűségétől függ

**Válasz:** a) Negatív: a részvények egy részét hitelből vesszük

Callnál $B = (uC_d - dC_u)/((u-d)(1+r)) \le 0$, mert $C_d$ kicsi $C_u$-hoz képest. A portfólió egy részvény töredéke, részben hitelből finanszírozva.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/one-step-binomial

Előző lecke: [Put–call paritás](https://quantsandbox.dev/hu/guide/derivatives/put-call-parity)

Következő lecke: [Kockázatsemleges valószínűségek](https://quantsandbox.dev/hu/guide/derivatives/risk-neutral)
