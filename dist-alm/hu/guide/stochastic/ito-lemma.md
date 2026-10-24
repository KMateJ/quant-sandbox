# Az Itô-lemma

Kvadratikus variáció, láncszabály Brown-mozgásra és a logaritmikus ár −½σ² driftje.

A „Véletlen bolyongás és Brown-mozgás” című lecke megmutatta, hogy a Brown-pályáknak sehol sincs meredekségük, ezért a szokásos analízis közvetlenül nem alkalmazható rájuk. Ez a lecke a helyettesítőjét mutatja be, az **Itô-lemmát**, vagyis a véletlen folyamatok függvényeire vonatkozó láncszabályt. Kulcsa egy meglepő tény a Brown-mozgás növekményeinek négyzetéről.

## Növekmények folytonos időben

Jelölje $dW_t$ egy Brown-mozgás (Wiener-folyamat) növekményét egy rövid $dt$ időszak alatt. A Brown-mozgás definíciója szerint ez normális eloszlású, várható értéke nulla, varianciája $dt$:

$$
dW_t \sim N(0,\ dt), \qquad \mathbb{E}[dW_t] = 0, \qquad \mathbb{E}\big[(dW_t)^2\big] = dt.
$$

A Brown-mozgás hajtotta folyamatokat szintén a növekményükkel írjuk le. Az általános **Itô-folyamatnak** van egy $a$ driftje és egy $b$ volatilitása, amelyek függhetnek az időtől és a pillanatnyi értéktől:

$$
dX_t = a(t, X_t)\,dt + b(t, X_t)\,dW_t.
$$

Olvassuk egyetlen kis lépés receptjeként: egy determinisztikus $a\,dt$ elmozdulás, plusz egy véletlen $b\,dW_t$ elmozdulás, amelynek jellemző mérete $b\sqrt{dt}$. Kis $dt$ esetén a véletlen rész sokkal nagyobb a drift résznél, hiszen $\sqrt{dt}$ sokkal nagyobb $dt$-nél.

## Kvadratikus variáció

A szokásos analízisben a kis növekmények négyzete elhanyagolható: ha $dx$ kicsi, $(dx)^2$ még sokkal kisebb, és a határátmenetben eltűnik. A Brown-mozgásnál ez nem így van. Osszuk fel a $[0, T]$ intervallumot $n$ darab $\Delta t = T/n$ hosszú lépésre, és adjuk össze a növekmények négyzetét:

$$
Q_n = \sum_{i=1}^{n} \big(W_{t_i} - W_{t_{i-1}}\big)^2.
$$

Minden négyzetes növekmény várható értéke $\Delta t$, így minden $n$-re $\mathbb{E}[Q_n] = n\,\Delta t = T$. Mindegyik varianciája $2\,\Delta t^2$ (ez a normális eloszlás egy tulajdonsága), a növekmények pedig függetlenek, ezért

$$
\operatorname{Var}(Q_n) = n \cdot 2\,\Delta t^2 = \frac{2T^2}{n} \longrightarrow 0 \quad \text{ha } n \to \infty.
$$

Az összeg megtartja a $T$ várható értéket, a véletlensége viszont eltűnik: a határértékben pontosan $T$. Ez a határérték a Brown-mozgás **kvadratikus variációja**. Példa: a $[0,1]$ intervallumon $Q_n$ szórása $\sqrt{2/n}$, ami $n = 10$ esetén $0{,}447$, $n = 100$ esetén $0{,}141$, $n = 1000$ esetén $0{,}0447$.

Egy sima pályára ugyanez az összeg nullához tart, mert minden négyzetes növekmény $\Delta t^2$ nagyságrendű. A Brown-mozgás annyira egyenetlen, hogy a négyzetes növekményei véges összeget adnak.

Az abszolút növekmények összege egészen másképp viselkedik. Minden $|\Delta W|$ várható értéke $\sqrt{2\Delta t/\pi}$, így a $[0,1]$ intervallumon a $\sum |\Delta W|$ **teljes variáció** várható értéke $n\sqrt{2/(\pi n)} = \sqrt{2n/\pi}$: $n = 10$ esetén kb. $2{,}52$, $n = 100$ esetén $7{,}98$, $n = 1000$ esetén $25{,}23$. Ez minden határon túl nő. A Brown-pálya által megtett út végtelen hosszú, a lépések négyzetének összege mégis az eltelt időhöz tart.

Az ábra négy Brown-pályát rajzol a $[0,1]$ intervallumon, mindegyiket $n$ darab $\Delta W \sim N(0, 1/n)$ normális növekményből, és mindegyikre a $\sum (\Delta W)^2$ futó összeget ábrázolja $t$ függvényében, a $t$ egyenessel együtt. Válts az $n = 10$, $100$ és $1000$ között, és nyomd meg néhányszor az „Új pályák” gombot. A futó összegek $n$ növelésével egyre szorosabban követik az egyenest. A 2000 pályán, $t = 1$-nél számolt kijelzők szerint a $\sum (\Delta W)^2$ átlaga 1 közelében marad, szórása $\sqrt{2/n}$-ként csökken, a $\sum |\Delta W|$ átlaga pedig $\sqrt{2n/\pi}$-ként nő.

*[Interaktív ábra: quadratic variation](https://quantsandbox.dev/hu/guide/stochastic/ito-lemma)*

Az eredményt a kis növekmények szorzási szabályaiként szokás felírni:

$$
(dW_t)^2 = dt, \qquad dt\,dW_t = 0, \qquad (dt)^2 = 0.
$$

> Kvadratikus variáció: a Brown-mozgás négyzetes növekményei a $[0,T]$ intervallumon $T$-t adnak összegként. Röviden: $(dW_t)^2 = dt$.

## Az Itô-lemma

Legyen $f(t, x)$ sima függvény, $X_t$ pedig a fenti Itô-folyamat. Az $Y_t = f(t, X_t)$ folyamat növekményét keressük. Fejtsük $f$-et másodrendig Taylor-sorba:

$$
df = \frac{\partial f}{\partial t}\,dt + \frac{\partial f}{\partial x}\,dX_t + \frac{1}{2}\frac{\partial^2 f}{\partial x^2}\,(dX_t)^2 + \cdots
$$

A szokásos analízisben a harmadik tagot elhagynánk. Itt meg kell tartani. Emeljük négyzetre a $dX_t = a\,dt + b\,dW_t$ növekményt a szorzási szabályokkal: a $(dt)^2$ és $dt\,dW_t$ tagok eltűnnek, csak $b^2 (dW_t)^2 = b^2\,dt$ marad meg:

$$
(dX_t)^2 = b^2\,dt.
$$

A magasabb rendű tagok $dt^{3/2}$ vagy kisebb nagyságrendűek, és eltűnnek. Behelyettesítve kapjuk az **Itô-lemmát**:

$$
df(t, X_t) = \left( \frac{\partial f}{\partial t} + a\,\frac{\partial f}{\partial x} + \frac{1}{2}\,b^2\,\frac{\partial^2 f}{\partial x^2} \right) dt + b\,\frac{\partial f}{\partial x}\,dW_t.
$$

A szokásos láncszabályhoz képest egyetlen új drifttag jelenik meg, a $\tfrac12 b^2 f''$. Ez a Brown-pályák egyenetlenségének ára: $f$ görbülete $X$ véletlen ingadozásait $f(X)$ szisztematikus driftjévé alakítja.

## A Brown-mozgás négyzete

Legyen $X_t = W_t$ (tehát $a = 0$, $b = 1$) és $f(x) = x^2$, ahol $f' = 2x$ és $f'' = 2$. Az Itô-lemma szerint

$$
d\big(W_t^2\big) = dt + 2W_t\,dW_t.
$$

A szokásos analízis csak a $2W_t\,dW_t$ tagot adná. A véletlen tag várható értéke nulla, így a felhalmozott növekmények várható értékét véve $\mathbb{E}[W_t^2] = t$ marad, összhangban a $\operatorname{Var}(W_t) = t$ tulajdonsággal. Az extra $dt$ nélkül a várható érték tévesen nulla maradna.

## A részvényár logaritmusa

A „Geometriai Brown-mozgás” lecke modellje $dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, vagyis egy Itô-folyamat $a = \mu S$ és $b = \sigma S$ együtthatókkal. Alkalmazzuk az Itô-lemmát az $f(S) = \ln S$ függvényre, ahol $f' = 1/S$ és $f'' = -1/S^2$:

$$
d\ln S_t = \left( \mu S \cdot \frac{1}{S} + \frac{1}{2}\,\sigma^2 S^2 \cdot \left(-\frac{1}{S^2}\right) \right) dt + \sigma S \cdot \frac{1}{S}\,dW_t = \left(\mu - \tfrac{1}{2}\sigma^2\right) dt + \sigma\,dW_t.
$$

A jobb oldal együtthatói állandók, így a $[0, T]$ intervallumon közvetlenül összegezhető:

$$
\ln S_T = \ln S_0 + \left(\mu - \tfrac{1}{2}\sigma^2\right) T + \sigma W_T.
$$

Ez a „Geometriai Brown-mozgás” leckében idézett megoldás, és a $-\tfrac12\sigma^2$ korrekció pontosan az Itô-féle extra tag. A naiv analízis $\mu$ log-driftet jósolt volna.

Példa: $S_0 = 100$, $\mu = 8\%$, $\sigma = 20\%$. A logár éves driftje $0{,}08 - \tfrac12 \cdot 0{,}2^2 = 0{,}06$, nem $0{,}08$. $T = 10$ év alatt a logár középpontja $\ln 100 + 0{,}6$, ami $100\,e^{0{,}6} \approx 182{,}21$ medián árnak felel meg. A naiv $\ln 100 + 0{,}8$ egyenes $100\,e^{0{,}8} \approx 222{,}55$-re mutatna, ami a **várható** ár, nem pedig az, ahol egy tipikus pálya végződik.

### Kidolgozott példa: A részvényár mediánja és várható értéke az Itô-lemmából

1. Legyen $S_0 = 100$, $\mu = 10\%$, $\sigma = 30\%$ és $T = 5$. A logár éves driftje.
   $$\mu - \tfrac12\sigma^2$$ → **0.055**
2. A medián ár öt év múlva: a logár középpontjának exponenciálisa.
   $$S_0\,e^{(\mu - \frac12\sigma^2)T}$$ → **131.65**
3. A várható ár öt év múlva.
   $$S_0\,e^{\mu T}$$ → **164.87**
4. A várható érték és a medián hányadosa: az Itô-korrekció mérete a teljes időtávon.
   $$e^{\frac12\sigma^2 T}$$ → **1.2523**

## A korrekció nagysága

Vegyünk egy napot, $\Delta t = 1/252$, $\sigma = 20\%$ mellett. A hozam véletlen része, $\sigma\,\Delta W$, jellemzően kb. $0{,}2 \times \sqrt{1/252} \approx 1{,}26\%$. Ennek négyzete kb. $\sigma^2 \Delta t \approx 0{,}016\%$, ugyanolyan nagyságrendű, mint a napi $\mu\,\Delta t \approx 0{,}032\%$ drift. Az ilyen négyzetek napról napra összeadva nem átlagolódnak ki, mert sosem negatívak. Ezért változtatja meg a másodrendű tag a driftet, és ezért nem hagyható el.

## Összefoglalás

- Egy Itô-folyamat $dX = a\,dt + b\,dW$ szerint mozog: egy driftlépés plusz egy kb. $b\sqrt{dt}$ méretű véletlen lépés.
- A Brown-növekmények négyzete az eltelt időt adja összegként: $(dW)^2 = dt$, míg $dt\,dW$ és $(dt)^2$ eltűnik.
- Itô-lemma: $df = (f_t + a f_x + \tfrac12 b^2 f_{xx})\,dt + b f_x\,dW$. A $\tfrac12 b^2 f_{xx}$ tag a szokásos analízishez képest új.
- GBM esetén $\ln S$-re alkalmazva $d\ln S = (\mu - \tfrac12\sigma^2)\,dt + \sigma\,dW$ adódik.

> A következő lecke, a „Mértékcsere és a Girsanov-tétel”, megmutatja, hogyan lép árazáskor $r$ a megoldásban szereplő $\mu$ drift helyére; ezután a „Monte Carlo-opcióárazás” az így kapott képlettel sorsol végső részvényárakat, és átlagolással becsül opciós árakat.

[Hasonlítsd össze a logár korrigált és naiv driftjét az Itô-folyamat laborban](https://quantsandbox.dev/hu/ito-process)

## Interaktív laborok

- [Itô-lemma vizualizáció: a −½σ² driftkorrekció](https://quantsandbox.dev/hu/ito-process)
- [Brown-mozgás szimulátor drifttel és volatilitással](https://quantsandbox.dev/hu/brownian-motion)

## Gyakorló kérdések

### 1. Egy $[0, 2]$ intervallumon futó Brown-pályát egyre finomabb lépésekre bontunk. Mihez tart a növekmények négyzetösszege, $\sum (\Delta W)^2$?

**Válasz:** 2

A Brown-mozgás kvadratikus variációja $[0, T]$-n $T$: minden $(\Delta W)^2$ várható értéke $\Delta t$, és az összeg ingadozása a lépések finomodásával eltűnik. Itt $T = 2$.

### 2. Egy részvény geometriai Brown-mozgást követ $\mu = 12\%$ és $\sigma = 40\%$ paraméterekkel. Mekkora a logár éves driftje? A választ százalékban add meg.

**Válasz:** 4%

Az Itô-lemma $\ln S$-re a $\mu - \tfrac12\sigma^2 = 0{,}12 - 0{,}08 = 0{,}04$ driftet adja. A hagyományos láncszabály 12%-ot mondana.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/ito-lemma

Előző lecke: [Az Itô-integrál](https://quantsandbox.dev/hu/guide/stochastic/ito-integral)

Következő lecke: [Kolmogorov-egyenletek és a Feynman–Kac-formula](https://quantsandbox.dev/hu/guide/stochastic/feynman-kac)
