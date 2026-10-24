# Reálkamat, infláció és inflációkövető kötvények

A Fisher-összefüggés, nominális és reál diszkontálás, a kiegyenlítő (breakeven) infláció és az inflációkövető kötvény árazása.

A „Kamat, kamatozás és diszkontálás” a kamatlábat egyszerű számként kezelte: a pénz évente $r$-rel nő. A gyakorlatban a visszakapott pénzen kevesebbet lehet venni, ha az árak emelkedtek, így egy bőkezűnek látszó kamat is veszteséget rejthet. Ez a lecke szétválasztja a pénzben kifejezett **nominális** kamatot a vásárlóerőben mért **reálkamattól**, és a felbontással olyan kötvényeket árazunk, amelyek kifizetései követik az inflációt. A „Kötvényárak és hozamok” leckére épít, és a felár fogalmát a „Hitelkockázat: csődvalószínűség és hitelfelár” leckéből kölcsönzi.

## Nominális és reál

A **nominális** összeg pénzegységek száma. A **reál** összeg ugyanez a pénz vásárlóerőben kifejezve, vagyis árindexszel deflálva. Ha az árak egy év alatt $(1+\pi)$-szeresükre nőnek, ahol $\pi$ az infláció, akkor a jövő évi 100 annyit vesz, mint ma a $100/(1+\pi)$.

Tegyük fel, hogy 100-at kölcsönzünk egy évre $i$ nominális kamattal, az infláció pedig $\pi$. Pénzben $100\,(1+i)$-t kapunk vissza, ami mai vásárlóerőben $100\,(1+i)/(1+\pi)$ értékű. A **reálkamat** $r$ a vásárlóerő növekedése:

$$
1 + r = \frac{1+i}{1+\pi}.
$$

## A Fisher-összefüggés

Átrendezve a reálkamat definíciója a **Fisher-összefüggés**:

$$
1 + i = (1+r)(1+\pi), \qquad i = r + \pi + r\pi \approx r + \pi.
$$

Az $i \approx r + \pi$ közelítés elhagyja az $r\pi$ keresztszorzatot, ami kicsi, ha mindkét kamat kicsi. $r = 2\%$ és $\pi = 3\%$ esetén a pontos nominális kamat $1{,}02 \times 1{,}03 - 1 = 5{,}06\%$, a közelítő 5,00%. Mérsékelt kamatoknál a különbség néhány század százalékpont; magas inflációnál már nem elhanyagolható.

## Reál pénzáramok diszkontálása

A kifizetés két leírása egyenértékű, ha nem keverjük őket. **A reál pénzáramokat a reálkamattal, a nominálisakat a nominális kamattal diszkontáljuk.** Egy kifizetés, amely $t$ év múlva mai vásárlóerőben 100, pénzben $100\,(1+\pi)^t$; ezt $(1+i)^t = (1+r)^t(1+\pi)^t$-vel diszkontálva $100/(1+r)^t$-t kapunk, ugyanazt, mint a reál összeget $r$-rel diszkontálva.

A klasszikus hiba a reál pénzáramokat nominális kamattal (vagy a nominálisakat reálkamattal) diszkontálni. Az eredmény az elsőt $(1+\pi)^t$-szeresével alulbecsüli, a másodikat ugyanennyivel felülbecsüli. 10 év alatt, 3% inflációnál az $1{,}03^{10} \approx 1{,}34$ szorzó az utolsó kifizetés értékét 34%-kal téveszti el.

## Inflációkövető kötvények

Az **inflációkövető kötvény** a kifizetéseit reálértékben rögzíti. A tőkéjét az árindex skálázza, a kupon pedig egy fix reálkamat erre a skálázott tőkére. $(1+\pi)^t$ indexszorzóval, $c$ reálkupon-kamattal és 100-as névértékkel a nominális kifizetés a $t$ időpontban

$$
100\,c\,(1+\pi)^t \quad (t = 1, \dots, T-1), \qquad 100\,(c+1)\,(1+\pi)^T \ \text{a lejáratkor.}
$$

Az ár 100 indexált tőkére vetítve a reál pénzáramok reálkamattal diszkontált összege:

$$
P = \sum_{t=1}^{T} \frac{100\,c}{(1+r)^t} + \frac{100}{(1+r)^T}.
$$

Az eredmény nem függ az inflációs előrejelzéstől: a konzisztencia-szabály szerint az indexált nominális pénzáramokat a Fisher-féle nominális kamattal diszkontálva ugyanazt a számot kapjuk. Ez az inflációkövető kötvény vonzereje. Reálértéke rögzített; a nominális kötvény reálértéke az inflációval változik.

*[Interaktív ábra: fisher real rate](https://quantsandbox.dev/hu/guide/fixed-income/real-rates-inflation)*

Az ábrán mindkét kötvény értéke 100 a várt inflációnál: a nominális kötvény kuponja a Fisher-féle nominális hozam, az inflációkövetőé a reálkamattal egyenlő reálkupon. A grafikon a mai vásárlóerőben mért értéküket mutatja a ténylegesen megvalósuló infláció függvényében. Az inflációkövető kötvény 100 marad; a nominális kötvény értéke csökken, ha az infláció a vártnál magasabb, mert kuponjai és tőkéje pénzben rögzítettek. 1%-os reálkamat, 3%-os várt és 5%-os tényleges infláció mellett a nominális (10 éves) kötvény reálértéke 85,17.

## Kiegyenlítő infláció

A piac mindkét típusú kötvényt árazza. Az azonos lejáratú kötvények $i$ nominális és $r$ reálhozama közötti különbség az az infláció, amelynél a befektető közömbös, a **kiegyenlítő (breakeven) inflációs ráta**:

$$
\pi_{\text{BE}} = \frac{1+i}{1+r} - 1 \approx i - r.
$$

Ha a nominális kötvény hozama 4,03%, az inflációkövetőé 1%, a kiegyenlítő infláció $1{,}0403/1{,}01 - 1 = 3{,}00\%$. Ha a tényleges infláció magasabb, az inflációkövető volt a jobb választás, ha alacsonyabb, a nominális kötvény. A kiegyenlítő infláció nem tiszta előrejelzés. A hitelfelárhoz hasonlóan piaci ár, amely kockázati kompenzációt is tartalmaz (inflációs bizonytalanság, likviditási különbségek), ezért eltérhet attól, amit a befektetők várnak.

## Egy inflációkövető kötvény árazása

Vegyünk egy 10 éves inflációkövető kötvényt 2%-os reálkuponnal, 1%-os reálhozamon árazva, évi 3% inflációval. Mivel a reálkupon a reálhozam fölött van, a kötvény az indexált tőkéje fölött forog. Az első nominális kupon az egyéves inflációval skálázott reálkupon, a tőkét tízévnyi infláció skálázza.

### Kidolgozott példa: Egy 10 éves inflációkövető kötvény 2%-os reálkuponnal

1. A reál annuitásfaktor 1%-nál, 10 évre.
   $$\frac{1 - 1{,}01^{-10}}{0{,}01}$$ → **9.4713**
2. A 2%-os reálkuponok jelenértéke 100 tőkére.
   $$2 \times 9{,}4713$$ → **18.9426**
3. Az indexált tőke jelenértéke.
   $$\frac{100}{1{,}01^{10}}$$ → **90.5287**
4. Az ár 100 indexált tőkére.
   $$P = 18{,}9426 + 90{,}5287$$ → **109.47**
5. Az első nominális kupon 3% inflációnál.
   $$100 \times 0{,}02 \times 1{,}03$$ → **2.06**
6. A lejáratkor visszafizetett nominális tőke.
   $$100 \times 1{,}03^{10}$$ → **134.39**

## Összefoglalás

- A reál összeg az árindexszel deflált nominális összeg; a reálkamat a vásárlóerő növekedése.
- A Fisher-összefüggés $1+i = (1+r)(1+\pi)$; az $i \approx r + \pi$ közelítés elhagyja az $r\pi$ keresztszorzatot.
- A reál pénzáramokat reálkamattal, a nominálisakat nominális kamattal diszkontáljuk; soha ne keverjük őket.
- Az inflációkövető kötvény reálértéke rögzített: tőkéje és kuponjai követik az árindexet, és a reál pénzáramok reálkamattal diszkontálásával árazzuk.
- A kiegyenlítő infláció, a nominális és a reálhozam különbsége, piaci ár, amely kockázati prémiumot is tartalmaz.

[Nyisd meg a Kötvény labort, és árazz kötvényeket különböző hozamokon](https://quantsandbox.dev/hu/bond-pricing)

## Interaktív laborok

- [Kötvényárazó kalkulátor és ár–hozam görbe](https://quantsandbox.dev/hu/bond-pricing)
- [A pénz időértéke és kamatoskamat-kalkulátor](https://quantsandbox.dev/hu/tvm)

## Gyakorló kérdések

### 1. A reálkamat 2%, a várt infláció 3%. Mekkora a Fisher-összefüggésből adódó pontos nominális kamat, százalékban?

**Válasz:** 5.06%

$1 + i = (1+r)(1+\pi) = 1{,}02 \times 1{,}03 = 1{,}0506$, tehát $i = 5{,}06\%$. A közelítő $r + \pi = 5\%$ kihagyja az $r\pi = 0{,}06\%$ keresztszorzatot.

### 2. Melyik kötvény nominális pénzáramai nőnek, ha az infláció a vártnál magasabb?

- a) A fix kuponos nominális kötvényé
- b) Az inflációkövető kötvényé
- c) Egyiké sem
- d) Mindkettőé

**Válasz:** b) Az inflációkövető kötvényé

Az inflációkövető kötvény tőkéjét és kuponjait az árindex skálázza, így nominális kifizetései nőnek az inflációval, reálértéke pedig állandó. A nominális kötvény kifizetései pénzben rögzítettek, így reálértéke csökken.

### 3. Egy nominális kötvény hozama 4,5%, egy azonos lejáratú inflációkövetőé 1,5%. Mekkora a pontos kiegyenlítő inflációs ráta, százalékban?

**Válasz:** 2.96%

$\pi_{\text{BE}} = 1{,}045/1{,}015 - 1 \approx 2{,}96\%$; a hozamok különbsége, 3,00%, kissé túlbecsüli.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/real-rates-inflation

Előző lecke: [Hitelkockázat: csődvalószínűség és hitelfelár](https://quantsandbox.dev/hu/guide/fixed-income/credit-risk)
