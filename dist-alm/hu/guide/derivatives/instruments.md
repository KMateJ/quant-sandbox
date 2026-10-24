# Határidős ügyletek, call és put opciók

Mi a derivatíva; forward, call és put kifizetése lejáratkor; long és short pozíció.

Ez a lecke a három alapvető származtatott terméket mutatja be: a határidős ügyletet, a call és a put opciót. Mindegyiket azzal írjuk le, mit fizet lejáratkor, mert minden későbbi árazási érvelés ebből indul. A kockázatmentes kamatlábat és a diszkontfaktort a „Kamat, kamatozás és diszkontálás” leckéből használjuk.

## Alaptermék és származtatott termék

Az **alaptermék** olyan eszköz, amellyel önmagában is kereskednek, például egy részvény. Mai árát $S_0$, egy későbbi $T$ időpontbeli (években mért) árát $S_T$ jelöli. Ma $S_0$ ismert, $S_T$ viszont nem.

A **származtatott termék** (derivatíva) olyan szerződés, amelynek kifizetését az alaptermék ára határozza meg. A szerződés rögzít egy $T$ **lejáratot** és egy szabályt, amely $S_T$-ből pénzösszeget csinál. Ez az összeg a **kifizetés**:

$$
X = f(S_T).
$$

Az $f$ függvényt a szerződés rögzíti; a lecke három terméke csak ebben különbözik. Végig feltesszük, hogy a részvény nem fizet osztalékot, nincsenek tranzakciós költségek, és az elszámolás pénzben történik: a felek az $X$ kifizetést cserélik ki, nem részvényeket.

## Long és short pozíció

Minden szerződésnek két oldala van. Aki az $X$ kifizetést kapja, az **hosszú** (long) pozícióban van; aki fizeti, az **rövid** (short) pozícióban. Amit lejáratkor az egyik fél nyer, azt a másik elveszíti, így a short pozíció kifizetése $-X$. Ezért elég a long oldalt leírni.

## A határidős ügylet

A **határidős ügylet** (forward) olyan ma kötött megállapodás, hogy $T$-ben a ma rögzített $K$ áron megvesszük az alapterméket; $K$ neve **szállítási ár**. Mindkét fél köteles teljesíteni. A vevő (long fél) $K$-t fizet, és $S_T$ értékű eszközt kap, így a kifizetése

$$
X_{\text{fwd}} = S_T - K.
$$

A kifizetés $S_T$-ben egy 1 meredekségű egyenes: pozitív, ha a részvény $K$ fölött zár, és negatív, ha alatta. Mivel a long fél veszíthet is, a szokásos határidős ügyletbe senki sem fizet a belépésért: $K$-t úgy választják, hogy a szerződés ma semmibe se kerüljön. Hogy ez melyik $K$, azt az „Arbitrázs és a határidős ár” lecke tárgyalja.

## A call opció

Az **opció** jogot ad a tulajdonosának, nem kötelezettséget. A $K$ **kötési árú** és $T$ lejáratú **vételi opció** (call) feljogosít arra, hogy $T$-ben $K$-ért megvegyük az alapterméket. A tulajdonos csak akkor él a jogával (hívja le az opciót), ha megéri: ha $S_T > K$, akkor $K$-ért vesz valamit, ami $S_T$-t ér; ha $S_T \le K$, hagyja lejárni. A call kifizetése tehát

$$
X_{\text{call}} = \max(S_T - K,\,0) = (S_T - K)^+.
$$

Az $x^+ = \max(x, 0)$ jelölést a továbbiakban végig használjuk. A határidős ügylethez képest a call levágja a kifizetés negatív részét: a tulajdonos megtartja a felfelé mozgás hasznát, lejáratkor pedig sosem fizet.

## A put opció

Az **eladási opció** (put) arra jogosít fel, hogy $T$-ben $K$ kötési áron eladjuk az alapterméket. A tulajdonos akkor hívja le, ha a részvény a kötési ár alatt zár, hiszen ekkor $K$-ért adhat el valamit, ami csak $S_T$-t ér:

$$
X_{\text{put}} = \max(K - S_T,\,0) = (K - S_T)^+.
$$

A put olyan, mint egy biztosítás a részvényre: ha az árfolyam $K$ alá esik, a put kifizeti a különbözetet. A kifizetés akkor a legnagyobb, $K$, ha a részvény értéktelenné válik, és nulla minden $S_T \ge K$ esetén.

Az itt leírt opciók **európaiak**: csak $T$-ben hívhatók le. Az **amerikai** opciók $T$-ig bármikor lehívhatók; ezekre a „Többlépéses fák és visszafelé indukció” leckében térünk vissza.

Az ábra a lejáratkori kifizetést mutatja $S_T$ függvényében. Válts a call, a put és a határidős ügylet között, és mozgasd a $K$ kötési árat. Figyeld meg, hogy a határidős egyenes pontosan $K$-ban metszi a nullát, míg mindkét opció kifizetésének $K$-ban töréspontja van, és az egyik oldalon nullán marad.

*[Interaktív ábra: payoff](https://quantsandbox.dev/hu/guide/derivatives/instruments)*

> Határidős kifizetés $S_T - K$, call kifizetés $(S_T - K)^+$, put kifizetés $(K - S_T)^+$. A határidős ügylet kötelezettség, az opció jog, ezért az opciónak ma ára van.

## Kifizetés és nyereség

Mivel az opció kifizetése sosem negatív, a jognak értéke van: a vevő a szerződéskötéskor **opciós díjat** (prémiumot) fizet az eladónak. A call mai árát $C_0$, a putét $P_0$ jelöli. A kifizetés ezt a költséget nem tartalmazza; a long pozíció **nyeresége** levonja:

$$
\text{nyereség}_{\text{call}} = (S_T - K)^+ - C_0\,e^{rT}.
$$

A díjat a 0 időpontban fizetjük, a kifizetés $T$-ben érkezik, ezért a díjat $e^{rT}$-vel felkamatoljuk, hogy azonos időpontbeli összegeket hasonlítsunk össze. Rövid lejáratnál és alacsony kamatnál ez a szorzó közel 1, ezért az alábbi példák egyszerűen levonják a díjat.

Példa: egy $K = 100$ kötési árú call 6-ba kerül. Ha $S_T = 115$, a kifizetés 15, a nyereség $15 - 6 = 9$. Ha $S_T = 103$, a kifizetés 3, a nyereség $-3$: az opciót lehívták, de nem hozta vissza az árát. Ha $S_T = 95$, a kifizetés 0, a veszteség a teljes 6-os díj. A fedezeti pont $K + C_0 = 106$.

Egy $K = 100$ kötési árú, 4-es díjú put kifizetése $S_T = 90$ mellett 10, a nyereség 6. A fedezeti pont $K - P_0 = 96$.

A short oldal nyeresége a kapott díj mínusz a kifizetés. A call eladója legfeljebb a díjat keresheti meg, vesztesége viszont korlátlan lehet; a put eladója legfeljebb $K - P_0$-t veszíthet.

A határidős ügyletnek nincs díja, így ott a kifizetés és a nyereség megegyezik. $K = 100$ és $S_T = 112$ mellett a long fél 12-t nyer, a short fél 12-t veszít.

### Kidolgozott példa: Egy long call nyeresége különböző záróárak mellett

1. Egy $K = 100$ kötési árú call ára 4,2. $S_T = 90$ mellett értéktelenül jár le, a veszteség a díj.
   $$(90 - 100)^+ - 4{,}2$$ → **-4.2**
2. $S_T = 100$ mellett a kifizetés még mindig nulla.
   $$(100 - 100)^+ - 4{,}2$$ → **-4.2**
3. $S_T = 110$ mellett a 10-es kifizetés már bőven fedezi a díjat.
   $$(110 - 100)^+ - 4{,}2$$ → **5.8**
4. $S_T = 120$ mellett $S_T$ minden további egysége egy egység nyereséget hoz.
   $$(120 - 100)^+ - 4{,}2$$ → **15.8**
5. A fedezeti pont a kötési ár plusz a díj.
   $$K + C_0$$ → **104.2**

## Összefoglalás

- A származtatott termék a $T$ lejáratkor $X = f(S_T)$ összeget fizet; az $f$ függvényt a szerződés rögzíti.
- A long fél kapja, a short fél fizeti $X$-et; a két kifizetés összege nulla.
- Határidős ügylet: kötelezettség, kifizetése $S_T - K$, a belépés ingyenes.
- Call: vételi jog, kifizetése $(S_T - K)^+$. Put: eladási jog, kifizetése $(K - S_T)^+$. Az opcióért díjat kell fizetni.
- A nyereség a kifizetés mínusz a belépés $T$-re felkamatolt költsége.

> A következő lecke összeadja ezeket a kifizetéseket. Mivel a kifizetések egyszerűen $S_T$ függvényei, egy szerződésekből álló portfólió az egyes kifizetések összegét fizeti.

[Építs és hasonlíts össze egyedi kifizetéseket a Kifizetés laborban](https://quantsandbox.dev/hu/payoff)

## Interaktív laborok

- [Opciós kifizetési diagram és stratégiaépítő](https://quantsandbox.dev/hu/payoff)

## Gyakorló kérdések

### 1. Egy $K = 100$ kötési árú európai put van nálad. Lejáratkor a részvény $S_T = 85$. Mennyi a kifizetés?

**Válasz:** 15

A put $(K - S_T)^+ = (100 - 85)^+ = 15$-öt fizet: 100-ért adsz el egy 85-öt érő részvényt.

### 2. Az alábbi pozíciók közül melyiknek korlátlan a lehetséges vesztesége lejáratkor?

- a) Long call
- b) Long put
- c) Short call
- d) Short put

**Válasz:** c) Short call

A short call $(S_T - K)^+$-t fizet, ami $S_T$ emelkedésével korlát nélkül nő. A short put legfeljebb $K - P_0$-t veszít, a long opciók legfeljebb a díjukat.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/instruments

Következő lecke: [Pozíciók kombinálása](https://quantsandbox.dev/hu/guide/derivatives/strategies)
