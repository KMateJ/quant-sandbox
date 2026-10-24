# Kötvényárak és hozamok

Kötvény mint pénzáramlások sora, lejáratig számított hozam, par, prémium és diszkont.

A kötvény a legegyszerűbb olyan értékpapír, amelynek értéke teljes egészében diszkontálásból adódik: rögzített időpontokban rögzített kifizetéseket ígér, az ára pedig az, amennyit ezek a kifizetések ma érnek. Ez a lecke beárazza a kötvényt, definiálja a hozamát, és megmagyarázza, miért mozog az ár és a hozam ellentétes irányban. A „Kamat, kamatozás és diszkontálás” lecke anyagára épül.

## A kötvény mint pénzáramlások sora

Egy egyszerű fix kamatozású kötvénynek van **névértéke** ($F$, más néven tőkeösszeg), éves **kuponrátája** ($c$) és **lejárata** ($T$ év). Ebben a témakörben mindig $F = 100$, és évente egy kuponfizetést feltételezünk. A tulajdonos minden $t = 1, \dots, T$ év végén $cF$ kupont kap, az utolsó kuponnal együtt pedig a névértéket is.

Példa: egy 10 éves, $c = 5\%$-os kötvény az 1–9. év végén 5-öt, a 10. év végén $5 + 100 = 105$-öt fizet. Ebben a leírásban semmi sem bizonytalan; feltesszük, hogy a kibocsátó nem megy csődbe.

## Az ár mint jelenérték

Diszkontáljunk minden pénzáramlást ugyanazzal az éves $y$ rátával, éves kamatozással, ahogy a „Kamat, kamatozás és diszkontálás” leckében, és adjuk össze a jelenértékeket. Az eredmény az **ár**, $P$:

$$
P = \sum_{t=1}^{T} \frac{cF}{(1+y)^t} + \frac{F}{(1+y)^T}.
$$

A kuponok annuitást alkotnak, így az összegnek zárt alakja van:

$$
P = cF\,\frac{1 - (1+y)^{-T}}{y} + \frac{F}{(1+y)^T}.
$$

Minden tag egy kifizetés szorozva az $1/(1+y)^t$ diszkontfaktorral. Minél távolabbi egy kifizetés, annál jobban zsugorodik.

### Kidolgozott példa: Egy hároméves kötvény árazása pénzáramlásonként

1. Egy hároméves, 4%-os kuponú kötvény 4-et, 4-et és 104-et fizet. $y = 5\%$ mellett az első kupont egy évvel diszkontáljuk.
   $$\frac{4}{1{,}05}$$ → **3.81**
2. A második kupont két évvel.
   $$\frac{4}{1{,}05^2}$$ → **3.63**
3. Az utolsó kupon és a névérték együtt érkezik, három év múlva.
   $$\frac{104}{1{,}05^3}$$ → **89.84**
4. Az ár a három jelenérték összege.
   $$P = 3{,}81 + 3{,}63 + 89{,}84$$ → **97.28**

## Lejáratig számított hozam

A piacon fordított az irány: az árat látjuk, $y$ az ismeretlen. A **lejáratig számított hozam** (YTM) az az egyetlen $y$ ráta, amellyel a pénzáramlások jelenértéke éppen a piaci árat adja. A beruházás-értékelés nyelvén ez annak a **belső megtérülési rátája** (IRR), hogy a kötvényt $P$-n megvesszük és lejáratig tartjuk.

$T > 1$ esetén $y$-ra nincs zárt képlet; numerikusan keressük meg (például intervallumfelezéssel), ami könnyű, mert az ár $y$-nak szigorúan csökkenő függvénye. A hozam összefoglaló szám: feltételezi, hogy minden pénzáramlást ugyanazzal a rátával diszkontálunk.

> Lejáratig számított hozam: az az egyetlen $y$ diszkontráta, amellyel az összes ígért pénzáramlás jelenértéke megegyezik a kötvény árával.

## Az ár–hozam kapcsolat

Az árképlet minden tagjában $y$ a nevezőben áll, így magasabb hozam alacsonyabb árat, alacsonyabb hozam magasabb árat jelent. A kapcsolat nem egyenes. Az $(1+y)^{-t}$ tagokat kétszer deriválva pozitív eredményt kapunk, tehát az $y \mapsto P(y)$ görbe **konvex**: alacsony hozamoknál meredeken esik, magas hozamoknál ellaposodik. Egy 1%-os hozamemelkedés ezért kevésbé csökkenti az árat, mint amennyivel egy 1%-os hozamcsökkenés növeli.

## Prémiumos, névértéken és diszkonton forgó kötvények

Vessük össze a kuponrátát a hozammal.

- **Névértéken (par)**: ha $c = y$, az ár $F$. A kupon minden évben pontosan annyi kamatot fizet, amennyit a piac elvár, így az áron keresztül nincs mit kiegyenlíteni.
- **Prémiummal**: ha $c > y$, a kötvény többet fizet a piaci rátánál, ezért a vevők $F$-nél többet adnak érte.
- **Diszkonttal**: ha $c < y$, a kupon túl alacsony, ezért a kötvény $F$ alatt forog, hogy a lejáratig $F$-ig emelkedő ár pótolja a hiányt.

## Elemi (zérókuponos) kötvények

A **zérókuponos kötvény** kuponrátája $c = 0$: csak $T$-ben fizet $F$-et. Ára egyetlen diszkontált összeg,

$$
P = \frac{F}{(1+y)^T},
$$

így a hozama közvetlenül kifejezhető: $y = (F/P)^{1/T} - 1$. Egy 10 éves zérókuponos kötvény $y = 6\%$ mellett $100/1{,}06^{10} \approx 55{,}84$-be kerül. Pozitív hozamnál a zérókuponos kötvény mindig diszkonton forog, és minden más kötvény építőköve: a kuponos kötvény zérókuponos kötvények csomagja, minden kifizetési időpontra egy.

## Folyó hozam

Gyakran egy egyszerűbb mutatót is közölnek, a **folyó hozamot** (current yield): az éves kupon osztva az árral, $cF/P$. Ez figyelmen kívül hagyja, hogy lejáratig az ár $F$-hez mozdul, és ebből nyereség vagy veszteség adódik. Diszkontos kötvénynél a YTM nagyobb a folyó hozamnál, az pedig nagyobb a kuponrátánál; prémiumos kötvénynél fordított a sorrend. Névértéken mindhárom egyenlő.

## Számpélda

Legyen $c = 5\%$, $T = 10$, $y = 6\%$. Az annuitásfaktor $(1 - 1{,}06^{-10})/0{,}06 \approx 7{,}360$, így

$$
P = 5 \cdot 7{,}360 + \frac{100}{1{,}06^{10}} \approx 36{,}80 + 55{,}84 = 92{,}64.
$$

A kupon a hozam alatt van, ezért a kötvény diszkonton forog. Folyó hozama $5/92{,}64 \approx 5{,}40\%$, az 5%-os kuponráta és a 6%-os YTM között. Ugyanilyen hozam mellett 7%-os kuponnal az ár kb. 107,36, prémiumos; $y = 5\%$ mellett az 5%-os kötvény pontosan 100-at ér.

Az ábra az árat mutatja 0% és 15% közötti hozamok függvényében, vízszintes vonallal a névértéknél (100) és függőlegessel a választott hozamnál. A kijelzők az árat, azt, hogy prémiummal, névértéken vagy diszkonttal forog-e, valamint a folyó hozamot mutatják. Mozgasd $y$-t a kuponráta egyik oldaláról a másikra, és figyeld meg, hogy az ár pontosan ott metszi a 100-at. Növeld $T$-t, és a görbe meredekebb és görbültebb lesz; állítsd $c$-t 0-ra, és zérókuponos kötvényt kapsz.

*[Interaktív ábra: price yield](https://quantsandbox.dev/hu/guide/fixed-income/bond-pricing)*

## Névértékhez húzás

Ha a hozam nem változik, a kötvény ára a lejárat közeledtével $F$ felé mozdul, mert egyre kevesebb kupon marad, amely túl- vagy alulárazott lehetne, és a névértéket egyre rövidebb időre diszkontáljuk. $c = 5\%$ és $y = 6\%$ mellett az ár 10 év hátralévő futamidőnél kb. 92,64, 5 évnél 95,79, egy évnél 99,06, lejáratkor pedig 100. Ez a **névértékhez húzás** (pull to par). Az ábrán rögzített hozam mellett csökkentsd $T$-t: a görbe a névértékvonal felé laposodik.

## Összefoglalás

- A fix kamatozású kötvény ismert pénzáramlások sora: évente $cF$ kupon, lejáratkor az $F$ névérték.
- Az ára e pénzáramlások jelenértéke; a lejáratig számított hozam az az egyetlen ráta, amely visszaadja a piaci árat (a kötvény IRR-je).
- Az ár és a hozam ellentétes irányban mozog, egy konvex görbe mentén.
- A kötvény $c = y$ esetén névértéken, $c > y$ esetén prémiummal, $c < y$ esetén diszkonttal forog; változatlan hozam mellett az ára a lejárat közeledtével a névérték felé tart.

> A következő lecke, a „Duráció és konvexitás”, az ár–hozam görbe meredekségét és görbületét méri.

[Árazz kötvényeket és számolj hozamot a Kötvényárazás laborban](https://quantsandbox.dev/hu/bond-pricing)

## Interaktív laborok

- [Kötvényárazó kalkulátor és ár–hozam görbe](https://quantsandbox.dev/hu/bond-pricing)

## Gyakorló kérdések

### 1. Egy hároméves, 100-as névértékű kötvény évi 5%-os kupont fizet. Mennyi az ára 6%-os hozam mellett?

**Válasz:** 97.33

$P = 5/1{,}06 + 5/1{,}06^2 + 105/1{,}06^3 \approx 4{,}72 + 4{,}45 + 88{,}16 = 97{,}33$.

### 2. Egy kötvény kuponrátája a lejáratig számított hozama alatt van. Hol áll az ára a névértékhez képest?

- a) A névérték fölött
- b) Pontosan a névértéken
- c) A névérték alatt
- d) A lejárattól függ

**Válasz:** c) A névérték alatt

$c < y$ esetén a kuponok kevesebbet fizetnek, mint amit a piac elvár, ezért a kötvény diszkonton forog; a lejáratig $F$-ig emelkedő ár pótolja a különbséget.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/bond-pricing

Következő lecke: [Duráció és konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity)
