# A Black–Scholes-képlet

A képlet levezetésének logikája, d₁ és d₂ jelentése, és mit hagy figyelmen kívül a modell.

Ez a lecke levezeti az európai call és put Black–Scholes-árát. Három korábbi eredményt rak össze: az árat mint diszkontált kockázatsemleges várható értéket („Kockázatsemleges valószínűségek”), a lognormális részvényárat $\mathbb{Q}$ alatt („Geometriai Brown-mozgás”) és a put–call paritást („Put–call paritás”). Kapcsolódik a „Delta és fedezés” leckéhez is, mert a képlet explicit deltát ad.

## Feltevések

A Black–Scholes-modell az alábbi feltevésekkel él. Mindegyik egyszerűsítés; az utolsó szakasz visszatér a legfontosabbakhoz.

- A részvény állandó $\sigma$ volatilitású geometriai Brown-mozgást követ, és nem fizet osztalékot.
- Az $r$ kockázatmentes kamatláb állandó és folytonos kamatozású; $r$-en lehet hitelt felvenni és betétet elhelyezni.
- A kereskedés folytonos, nincs tranzakciós költség és adó, a shortolás megengedett.
- Nincs arbitrázs.
- Az opció európai: csak a $T$ lejáratkor hívható le.

E feltevések mellett az opció folytonos delta-fedezéssel replikálható, így ára a replikáció költsége. Ahogy a fás leckékben, ez a költség a $\mathbb{Q}$ kockázatsemleges mérték szerinti diszkontált várható kifizetés.

## Az ár mint várható érték

$K$ kötési árú callra a kifizetés $X = (S_T - K)^+$, így

$$
C_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\left[(S_T - K)^+\right].
$$

$\mathbb{Q}$ alatt a részvény $r$ driftű GBM. A $W_T^{\mathbb{Q}} = \sqrt{T}\,Z$ jelöléssel, ahol $Z \sim N(0,1)$,

$$
S_T = S_0 \exp\!\left( \left(r - \tfrac{1}{2}\sigma^2\right)T + \sigma\sqrt{T}\,Z \right).
$$

## A Black–Scholes-differenciálegyenlet

Ez a várható érték másként is levezethető — eredetileg Black és Scholes így érvelt. Tartsunk egy portfóliót: long pozíció egy $V(S,t)$ értékű opcióban, short pozíció $\Delta$ részvényben. Az Itô-lemma szerint az opció értékének változása

$$
dV = \left( \frac{\partial V}{\partial t} + \tfrac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt + \frac{\partial V}{\partial S}\,dS.
$$

A $\Delta = \partial V/\partial S$ választással kiesik a véletlen $dS$ tag, így a fedezett $\Pi = V - \Delta S$ portfólió kockázatmentes, ezért $r$ ütemben kell kamatoznia. Hozamát $r\Pi$-vel egyenlővé téve adódik a **Black–Scholes parciális differenciálegyenlet**:

$$
\frac{\partial V}{\partial t} + \tfrac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + rS\frac{\partial V}{\partial S} - rV = 0.
$$

A részvényre szóló minden európai opció ugyanezt az egyenletet elégíti ki; csak a lejáratkori feltétel más. A call esetén ez $V(S,T) = (S_T - K)^+$, és az egyenletet ezzel a peremfeltétellel megoldva pontosan a lenti képletet kapjuk. A két út egyenértékűségét a Feynman–Kac-tétel biztosítja: a PDE megoldását diszkontált kockázatsemleges várható értékként írja fel.

## A képlet levezetése

A számolás három lépés.

1. Határozzuk meg, mikor hívják le az opciót: $S_T > K$ ekvivalens azzal, hogy $Z > -d_2$, ahol $d_2 = \dfrac{\ln(S_0/K) + (r - \frac{1}{2}\sigma^2)T}{\sigma\sqrt{T}}$.
2. Bontsuk fel a kifizetést: $(S_T - K)^+ = S_T\,\mathbf{1}_{\{S_T > K\}} - K\,\mathbf{1}_{\{S_T > K\}}$, ahol $\mathbf{1}$ értéke 1, ha az esemény bekövetkezik, különben 0.
3. Vegyük külön-külön a két rész várható értékét, és diszkontáljunk.

A második rész a könnyebb. Mivel $Z$ standard normális és $N$ szimmetrikus,

$$
\mathbb{Q}(S_T > K) = \mathbb{Q}(Z > -d_2) = N(d_2).
$$

Az első részhez jelölje $\varphi$ a standard normális sűrűségfüggvényt. A kitevőben teljes négyzetté kiegészítve $e^{\sigma\sqrt{T}z - \frac{1}{2}\sigma^2 T}\,\varphi(z) = \varphi(z - \sigma\sqrt{T})$, így

$$
\mathbb{E}^{\mathbb{Q}}\left[S_T\,\mathbf{1}_{\{S_T > K\}}\right] = S_0 e^{rT} \int_{-d_2}^{\infty} \varphi(z - \sigma\sqrt{T})\,dz = S_0 e^{rT}\, N(d_2 + \sigma\sqrt{T}).
$$

Legyen $d_1 = d_2 + \sigma\sqrt{T}$. Mindkét részt $e^{-rT}$-vel diszkontálva kapjuk a **Black–Scholes-képletet**:

$$
C_0 = S_0\,N(d_1) - K e^{-rT} N(d_2), \qquad d_{1,2} = \frac{\ln(S_0/K) + \left(r \pm \frac{1}{2}\sigma^2\right)T}{\sigma\sqrt{T}}.
$$

A valódi $\mu$ drift sehol sem szerepel. Két befektető, akik a várható hozamban nem értenek egyet, de $\sigma$-ban igen, ugyanazt az árat kapják.

## A két tag jelentése

A képlet szerkezete: „kapott részvény mínusz kifizetett kötési ár, mindkettő valamivel súlyozva”.

- $N(d_2)$ annak $\mathbb{Q}$-valószínűsége, hogy az opciót lehívják, így $Ke^{-rT}N(d_2)$ a várható kötésiár-fizetés jelenértéke.
- $S_0 N(d_1)$ annak jelenértéke, hogy a lehívási állapotokban megkapjuk a részvényt. Nagyobb, mint $S_0 N(d_2)$, mert a lehívás éppen akkor történik, amikor $S_T$ magas.
- $N(d_1) = \partial C_0/\partial S_0$ a call **deltája**: a replikáló portfólió $N(d_1)$ részvényt tart, és $Ke^{-rT}N(d_2)$ hitelt vesz fel.

Az utolsó pont a fás $C = \Delta S + B$ eredmény folytonos változata, $\Delta = N(d_1)$ és $B = -Ke^{-rT}N(d_2)$ mellett. A képlet deriválásakor $d_1$ és $d_2$ $S_0$-függéséből további tagok is keletkeznek, de ezek pontosan kiejtik egymást.

> $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$, ahol $d_2 = d_1 - \sigma\sqrt{T}$. $N(d_2)$ a kockázatsemleges lehívási valószínűség, $N(d_1)$ a delta.

## A put ára

A $C_0 - P_0 = S_0 - Ke^{-rT}$ put–call paritás minden arbitrázsmentes modellben teljesül, így itt is. $P_0$-ra megoldva és $1 - N(x) = N(-x)$-et használva:

$$
P_0 = K e^{-rT} N(-d_2) - S_0\,N(-d_1).
$$

A put deltája $N(d_1) - 1 = -N(-d_1)$, $-1$ és $0$ közé esik.

## Számpélda

Legyen $S_0 = 100$, $K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$. Ekkor

$$
d_1 = \frac{\ln 1 + (0{,}05 + 0{,}02)}{0{,}2} = 0{,}35, \qquad d_2 = 0{,}35 - 0{,}2 = 0{,}15.
$$

A standard normális eloszlás táblázatából $N(0{,}35) \approx 0{,}6368$ és $N(0{,}15) \approx 0{,}5596$. A diszkontfaktor $e^{-0{,}05} \approx 0{,}9512$. Így $C_0 \approx 100 \cdot 0{,}6368 - 95{,}12 \cdot 0{,}5596 \approx 10{,}45$, a paritásból pedig $P_0 \approx 10{,}45 - (100 - 95{,}12) \approx 5{,}57$. A call deltája 0,637, és 56% a kockázatsemleges esélye a lehívásnak.

### Kidolgozott példa: Egy pénzben lévő call fél évre

1. Legyen $S_0 = 110$, $K = 100$, $r = 5\%$, $\sigma = 25\%$ és $T = 0{,}5$, így $\sigma\sqrt{T} \approx 0{,}1768$.
   $$d_1 = \frac{\ln 1{,}1 + (0{,}05 + 0{,}03125) \cdot 0{,}5}{0{,}1768}$$ → **0.769**
2. Vonjuk le $\sigma\sqrt{T}$-t:
   $$d_2 = d_1 - \sigma\sqrt{T}$$ → **0.5922**
3. A delta:
   $$N(d_1)$$ → **0.779**
4. A lehívás kockázatsemleges valószínűsége:
   $$N(d_2)$$ → **0.7231**
5. Az ár, $Ke^{-rT} = 100\,e^{-0{,}025} \approx 97{,}53$ mellett:
   $$C_0 = 110 \cdot 0{,}779 - 97{,}53 \cdot 0{,}7231$$ → **15.17**

## Az ár függése a bemenetektől

- **Részvényár** ($S_0$): a call drágul, a put olcsóbb lesz; a meredekségek a delták.
- **Volatilitás** ($\sigma$): mindkét ár nő. A tulajdonos az egyik oldalon nyer a nagy mozgásokon, a másikon legfeljebb az opciós díjat veszíti el.
- **Lejárat** ($T$): osztalék nélkül a call ára $T$-vel nő; több idő nagyobb szóródást ad $S_T$-ben, és kisebb a kötési ár jelenértéke.
- **Kamatláb** ($r$): a call drágul, a put olcsóbb lesz, mert a kötési árat később fizetjük, és jobban diszkontáljuk.

Két határeset ellenőrzi a képletet. Ha $\sigma \to 0$, a részvény determinisztikusan $r$ ütemben nő, és $C_0 \to (S_0 - Ke^{-rT})^+$, ami a „Put–call paritás” lecke alsó korlátja. Ha $T \to 0$, az ár a $(S_0 - K)^+$ kifizetéshez tart.

Az ábra az árat mutatja $S_0$ függvényében $K = 100$ mellett, szaggatottan a lejáratkori kifizetéssel. Válts a call és a put között. Növeld $\sigma$-t vagy $T$-t: a görbe elemelkedik a kifizetéstől, leginkább a kötési ár körül (kivétel a mélyen pénzben lévő put, amelynek értéke a kifizetés alá is kerülhet); csökkentsd őket, és a görbe rásimul a kifizetésre. Az $S_0 = 100$-nál mutatott értékek (ár, $d_1$, $d_2$, $N(d_1)$, $N(d_2)$) alapján a számpélda megismételhető.

*[Interaktív ábra: black scholes price](https://quantsandbox.dev/hu/guide/derivatives/toward-black-scholes)*

## A modell korlátai

A piaci opcióárakból visszaszámolható egy volatilitás: az **implikált volatilitás** az a $\sigma$, amellyel a Black–Scholes-képlet a megfigyelt árat adja. Ha a modell pontos lenne, ugyanarra a részvényre szóló minden opció implikált volatilitása azonos volna. A valóságban az implikált volatilitás függ a kötési ártól (ez a **volatilitásmosoly** vagy ferdeség; az alacsony kötési árú opciók rendszerint drágábbak) és a lejárattól.

A fő ok, hogy egyes feltevések nem teljesülnek: a volatilitás nem állandó, hanem véletlenszerűen változik, és esésnél jellemzően megugrik; az árak néha ugranak; a hozamok eloszlásának vastagabb a farka a normálisnál. A Heston-modellhez hasonló modellek megtartják a kockázatsemleges árazás keretét, de a volatilitásnak saját véletlen folyamatot adnak, és ebből mosoly adódik. A Black–Scholes-modell ennek ellenére közös nyelv maradt: az árakat implikált volatilitásban jegyzik, deltája pedig a fedezés kiindulópontja.

## Összefoglalás

- A Black–Scholes-feltevések mellett $C_0 = e^{-rT}\mathbb{E}^{\mathbb{Q}}[(S_T - K)^+]$, ahol $S_T$ lognormális, $r$ drifttel.
- Az eredmény $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$; a put ára a paritásból adódik.
- $N(d_2)$ a kockázatsemleges lehívási valószínűség, $N(d_1)$ a delta; a valódi $\mu$ drift nem szerepel.
- Az árak $\sigma$-val nőnek; a volatilitásmosoly mutatja, hogy egyetlen állandó $\sigma$ nem illeszkedik a piachoz, ezzel foglalkozik a Heston-labor.

[Vizsgáld az árakat és a görögöket a Black–Scholes laborban](https://quantsandbox.dev/hu/black-scholes)

## Interaktív laborok

- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)
- [Heston-modell: sztochasztikus volatilitás szimulátor](https://quantsandbox.dev/hu/heston)

## Gyakorló kérdések

### 1. Mit mér $N(d_2)$ a Black–Scholes-képletben?

- a) Annak kockázatsemleges valószínűségét, hogy a call pénzben zár
- b) Annak valós valószínűségét, hogy a call pénzben zár
- c) A call deltáját
- d) Az $e^{-rT}$ diszkontfaktort

**Válasz:** a) Annak kockázatsemleges valószínűségét, hogy a call pénzben zár

$N(d_2) = \mathbb{Q}(S_T > K)$, vagyis $\mathbb{Q}$ szerinti valószínűség, nem a valós mérték szerinti. A delta $N(d_1)$.

### 2. Árazz be egy európai callt: $S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$.

**Válasz:** 10.45

$d_1 = 0{,}35$, $d_2 = 0{,}15$, így $C_0 = 100\,N(0{,}35) - 100\,e^{-0{,}05}N(0{,}15) \approx 63{,}68 - 53{,}23 = 10{,}45$.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/toward-black-scholes

Előző lecke: [Geometriai Brown-mozgás](https://quantsandbox.dev/hu/guide/derivatives/gbm)

Következő lecke: [A görögök: gamma, vega, théta és rhó](https://quantsandbox.dev/hu/guide/derivatives/greeks)
