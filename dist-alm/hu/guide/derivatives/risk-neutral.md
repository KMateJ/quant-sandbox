# Kockázatsemleges valószínűségek

A replikációs ár mint diszkontált várható érték a q súlyokkal; a P és a Q mérték szerepe.

„Az egylépéses binomiális modell” leckében a call ára egy replikáló portfólió költségeként adódott: $C_0 = \Delta S_0 + B$. Ez a lecke ezt az árat a két lehetséges kifizetés diszkontált súlyozott átlagaként írja fel. A súlyok valószínűségként viselkednek; ezek a **kockázatsemleges valószínűségek**, amelyeket minden későbbi árazási modell használ.

## A kiinduló modell

Az egylépéses modellt változatlanul hagyjuk: a részvény $S_0$-ról $uS_0$-ra vagy $dS_0$-ra lép, a kötvény a periódus alatt $(1+r)$-szeresére nő, és $d < 1+r < u$. Az opció felfelé állapotban $C_u$-t, lefelé állapotban $C_d$-t fizet. A felfelé állapot valós valószínűsége $p$, ahol $0 < p < 1$.

## A replikációs ár átírása

Induljunk ki az előző lecke replikáló portfóliójából:

$$
\Delta = \frac{C_u - C_d}{(u-d)S_0}, \qquad B = \frac{uC_d - dC_u}{(u-d)(1+r)}.
$$

Adjuk össze $\Delta S_0$-t és $B$-t, közös nevezőre hozva $(u-d)(1+r)$-rel:

$$
C_0 = \frac{(1+r)(C_u - C_d) + uC_d - dC_u}{(u-d)(1+r)}.
$$

Csoportosítsuk a $C_u$-t és a $C_d$-t tartalmazó tagokat:

$$
C_0 = \frac{1}{1+r}\left[\frac{(1+r) - d}{u-d}\,C_u + \frac{u - (1+r)}{u-d}\,C_d\right].
$$

Legyen

$$
q = \frac{(1+r) - d}{u - d}, \qquad 1 - q = \frac{u - (1+r)}{u-d}.
$$

Ekkor az ár alakja

$$
C_0 = \frac{1}{1+r}\big[q\,C_u + (1-q)\,C_d\big].
$$

## A $q$ mint valószínűség

A $d < 1+r < u$ arbitrázsmentességi feltétel miatt a $(1+r) - d$ számláló pozitív és kisebb $u - d$-nél, tehát $0 < q < 1$. A $q$ és $1-q$ súly pozitív, összegük egy. Két kimenetelen egy valószínűséghez ennyi kell. Jelölje $\mathbb{Q}$ azt a valószínűségi mértéket, amely a felfelé állapotnak $q$ valószínűséget ad; ekkor az ár

$$
C_0 = \frac{1}{1+r}\,\mathbb{E}^{\mathbb{Q}}[X],
$$

ahol $X$ az 1. időpontbeli kifizetés. Ugyanez a képlet bármely kifizetésre érvényes, mert a levezetés sehol nem használta ki a call alakját. Ha az arbitrázsmentességi feltétel sérül, $q$ kiesik a $(0,1)$ intervallumból, és a képletnek nincs értelme; ez összhangban van azzal, hogy egy ilyen piacon egyáltalán nincsenek konzisztens árak.

> **Kockázatsemleges árazás.** Ha $q = \frac{(1+r)-d}{u-d}$, bármely $X$ kifizetés arbitrázsmentes ára $\frac{1}{1+r}\mathbb{E}^{\mathbb{Q}}[X]$: a $\mathbb{Q}$ szerinti várható kifizetés, a kockázatmentes kamattal diszkontálva.

## A valós $p$ valószínűség nem szerepel

A $q$ képletében csak $u$, $d$ és $r$ szerepel, a valós $p$ valószínűség nem. Két befektető, akik nem értenek egyet abban, mennyire valószínű a felfelé lépés, mégis ugyanazt az opcióárat kapják, ha $S_0$-ban, $u$-ban, $d$-ben és $r$-ben egyetértenek. Ennek oka a replikációs érv: a portfólió minden állapotban reprodukálja a kifizetést, így közömbös, milyen gyakran következnek be az egyes állapotok.

A valós valószínűség a részvényáron keresztül már hat. Ha a piac nagyon valószínűnek tartja a felfelé lépést, felveri $S_0$-t, és $S_0$ bemenő adat. Adott $S_0$ mellett viszont az opció ára már nem függ tovább $p$-től.

## Kidolgozott példa

Használjuk az előző lecke számait: $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$, $r = 2\%$, $K = 100$, így $C_u = 20$ és $C_d = 0$.

$$
q = \frac{1{,}02 - 0{,}9}{1{,}2 - 0{,}9} = \frac{0{,}12}{0{,}3} = 0{,}4, \qquad C_0 = \frac{0{,}4\cdot 20 + 0{,}6\cdot 0}{1{,}02} \approx 7{,}84.
$$

Ez ugyanaz a 7,84, amelyet a replikáló portfólió adott. Tegyük fel most, hogy a felfelé lépés valós valószínűsége $p = 0{,}6$. Ha a $\mathbb{P}$ szerinti várható kifizetést a kockázatmentes kamattal diszkontáljuk, a **naiv árat** kapjuk:

$$
\frac{1}{1{,}02}\,\mathbb{E}^{\mathbb{P}}[X] = \frac{0{,}6\cdot 20}{1{,}02} \approx 11{,}76.
$$

Ha a call 11,76-on forogna, eladhatnánk, 7,84-ért felépíthetnénk a replikáló portfóliót, és kockázat nélkül megtarthatnánk 3,92-t. A naiv ár tehát hibás, és a hiba abból ered, hogy egy kockázatos kifizetést a kockázatmentes kamattal diszkontáltunk.

### Kidolgozott példa: Egy put árazása kétféleképpen

1. Ugyanaz a fa, most egy $K = 100$ kötési árú put: $P_u = (100 - 120)^+ = 0$ és $P_d = (100 - 90)^+ = 10$. $q = 0{,}4$ mellett a kockázatsemleges ár
   $$P_0 = \frac{0{,}4 \cdot 0 + 0{,}6 \cdot 10}{1{,}02}$$ → **5.88**
2. Replikálás: a részvénypozíció negatív, vagyis shortolás.
   $$\Delta = \frac{0 - 10}{120 - 90}$$ → **-0.3333**
3. A kötvénypozíció betét.
   $$B = \frac{10 - (-\tfrac{1}{3}) \cdot 90}{1{,}02}$$ → **39.22**
4. A portfólió költsége ugyanez az ár.
   $$\Delta S_0 + B = -33{,}33 + 39{,}22$$ → **5.88**

## A részvény hozama $\mathbb{Q}$ alatt $r$

Alkalmazzuk az árazási képletet magára a részvényre, amelynek kifizetése $uS_0$ vagy $dS_0$:

$$
\mathbb{E}^{\mathbb{Q}}[S_1] = q\,uS_0 + (1-q)\,dS_0 = S_0\big(d + q(u-d)\big) = (1+r)\,S_0.
$$

$\mathbb{Q}$ alatt a részvény várható hozama a kockázatmentes kamatláb. Innen a név: $\mathbb{Q}$ az a valószínűség, amely mellett egy kockázatsemleges befektető, aki a kockázatvállalásért nem vár többlethozamot, elfogadná a megfigyelt árakat. Másképp fogalmazva, a diszkontált részvényár várható értéke a mai ár,

$$
\mathbb{E}^{\mathbb{Q}}\left[\frac{S_1}{1+r}\right] = S_0,
$$

vagyis a diszkontált ár $\mathbb{Q}$ alatt **martingál**: várható jövőbeli értéke a jelenlegi értéke.

A valós valószínűség szerint a részvény általában többet hoz. A $p = 0{,}6$ példában a várható növekedési szorzó $0{,}6\cdot 1{,}2 + 0{,}4\cdot 0{,}9 = 1{,}08$, azaz 8% várható hozam, szemben a $\mathbb{Q}$ szerinti 2%-kal. A 6% különbség a kockázati prémium. Képzeld el $\mathbb{Q}$-t egy szándékosan cinkelt dobókockaként: az oldalai ugyanazok, de a súlyokat úgy választjuk, hogy minden forgalmazott termék átlagosan pontosan $r$-et hozzon. Számítási eszköz, nem előrejelzés.

## Naiv ár és arbitrázsmentes ár

Az ábra rögzíti az $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$ és $K = 100$ értékeket, és két árat rajzol a valós $p$ valószínűség függvényében. A $\frac{1}{1+r}\mathbb{E}^{\mathbb{P}}[X]$ naiv ár $p$-vel nő, az arbitrázsmentes ár vízszintes egyenes. A kettő ott metszi egymást, ahol $p = q$. Mozgasd $p$-t, és figyeld meg, hogy csak a naiv ár és a $\mathbb{P}$ szerinti várható részvényhozam változik; aztán mozgasd $r$-et, és figyeld meg, hogy $q$ és az arbitrázsmentes ár változik, a $\mathbb{Q}$ szerinti várható hozam pedig mindig $r$.

*[Interaktív ábra: real vs risk neutral](https://quantsandbox.dev/hu/guide/derivatives/risk-neutral)*

## $\mathbb{P}$ és $\mathbb{Q}$ szerepe

- $\mathbb{P}$ azt írja le, ami ténylegesen történik. Előrejelzésre, kockázatmérésre és várható hozamok becslésére használjuk.
- $\mathbb{Q}$-t a forgalmazott termékek árai határozzák meg. Replikálható derivatívák árazására használjuk.
- A két mérték ugyanazokat a kimeneteleket tartja lehetségesnek; csak a rájuk tett súlyokban különböznek.

## Összefoglalás

- A replikációs ár felírható $C_0 = \frac{1}{1+r}[qC_u + (1-q)C_d]$ alakban, ahol $q = \frac{(1+r)-d}{u-d}$.
- Az arbitrázsmentesség, $d < 1+r < u$, pontosan a $0 < q < 1$ feltétel.
- A valós $p$ valószínűség nem szerepel az árban; ha $\mathbb{E}^{\mathbb{P}}[X]$-et $r$-rel diszkontáljuk, hibás, arbitrálható árat kapunk.
- $\mathbb{Q}$ alatt a részvény a kockázatmentes kamatot hozza, $\mathbb{E}^{\mathbb{Q}}[S_1] = (1+r)S_0$, és a diszkontált ár martingál.

[Hasonlítsd össze a valós és a kockázatsemleges súlyokat a Binomiális laborban](https://quantsandbox.dev/hu/binomial)

## Interaktív laborok

- [Binomiális opcióárazó fa kalkulátor](https://quantsandbox.dev/hu/binomial)

## Gyakorló kérdések

### 1. Egy egylépéses modellben $u = 1{,}1$, $d = 0{,}9$, a periódusra vonatkozó egyszerű kamatláb $r = 2\%$. Mennyi a felfelé lépés $q$ kockázatsemleges valószínűsége?

**Válasz:** 0.6

$q = ((1+r) - d)/(u - d) = (1{,}02 - 0{,}9)/(1{,}1 - 0{,}9) = 0{,}12/0{,}2 = 0{,}6$.

### 2. Két kereskedő egyetért $S_0$-ban, $u$-ban, $d$-ben és $r$-ben, de a felfelé lépés valós $p$ valószínűségében nem. Különböző opcióárat kapnak?

- a) Nem: $q$ csak $u$-tól, $d$-től és $r$-től függ
- b) Igen: a nagyobb $p$-t feltételező magasabb call árat kap
- c) Igen, hacsak nem $p = 0{,}5$
- d) Csak putoknál

**Válasz:** a) Nem: $q$ csak $u$-tól, $d$-től és $r$-től függ

A replikáló portfólió mindkét állapotban reprodukálja a kifizetést, így az, hogy melyik állapot milyen gyakori, sehol nem jelenik meg. Adott $S_0$ mellett az ár nem függ $p$-től.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/risk-neutral

Előző lecke: [Az egylépéses binomiális modell](https://quantsandbox.dev/hu/guide/derivatives/one-step-binomial)

Következő lecke: [Többlépéses fák és visszafelé indukció](https://quantsandbox.dev/hu/guide/derivatives/multi-step-trees)
