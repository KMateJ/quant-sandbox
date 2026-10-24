# Hozamok és volatilitás

Egyszerű és logaritmikus hozam, szórás, évesítés és a négyzetgyök-szabály.

A „Kamat, kamatozás és diszkontálás” című lecke ismert ütemben növekvő pénzzel foglalkozott. Egy részvény nem ilyen: az árfolyama fel-le mozog, és senki sem tudja pontosan előre jelezni. Ez a lecke bevezeti az ilyen mozgások leírására használt két számot, az átlagos hozamot és a volatilitást, és megmutatja, hogyan függ mindkettő a tartási idő hosszától.

## Árfolyamok és hozamok

Jelölje $S_t$ egy részvény árfolyamát a $t$ időpontban. Magukat az árfolyamokat nehéz összehasonlítani: egy 5 egységnyi elmozdulás sokat jelent egy 20-as részvénynél, és keveset egy 1000-esnél. A befektetőt a kiinduló árhoz viszonyított változás érdekli. Ezért árfolyamok helyett **hozamokat** vizsgálunk, vagyis egy időszak alatti relatív változást.

A lecke végig osztalékot nem fizető részvényt feltételez, így a hozam teljes egészében az árváltozásból származik.

## Egyszerű hozam

A $t-1$ és $t$ közötti **egyszerű hozam**

$$
R_t = \frac{S_t - S_{t-1}}{S_{t-1}} = \frac{S_t}{S_{t-1}} - 1.
$$

A hétköznapi „10%-ot emelkedett a részvény” mondat erre a számra utal. A hátránya akkor jön elő, amikor több időszakot fűzünk egymás után. Két időszak alatt a teljes növekedési tényező az $(1+R_1)(1+R_2)$ szorzat, nem a hozamok összege.

Példa: az árfolyam 100-ról 110-re megy, majd vissza 99-re. Az egyszerű hozamok $+10\%$ és $-10\%$. Összegük nulla, a befektető mégis 1%-ot veszített, hiszen $1{,}1 \times 0{,}9 = 0{,}99$.

## Loghozam

A **loghozam** (folytonos hozam) a növekedési tényező természetes logaritmusa:

$$
r_t = \ln\frac{S_t}{S_{t-1}} = \ln(1 + R_t).
$$

Ez az a ráta, amely az időszak alatt folytonosan kamatozva $S_{t-1}$-ből $S_t$-t csinál, pontosan úgy, mint a „Kamat, kamatozás és diszkontálás” leckében: $S_t = S_{t-1}e^{r_t}$. Mivel a logaritmus a szorzatot összeggé alakítja, az egymást követő időszakok loghozamai összeadódnak:

$$
\ln\frac{S_n}{S_0} = \ln\frac{S_1}{S_0} + \ln\frac{S_2}{S_1} + \cdots + \ln\frac{S_n}{S_{n-1}} = r_1 + r_2 + \cdots + r_n.
$$

A fenti példában $\ln 1{,}1 \approx 0{,}0953$ és $\ln 0{,}9 \approx -0{,}1054$. Összegük $-0{,}0101 = \ln 0{,}99$, ami helyesen mutatja az 1%-os veszteséget. Kis elmozdulásoknál a kétféle hozam szinte egyenlő, mert nullához közeli $R$ esetén $\ln(1+R) \approx R$.

Innentől a „hozam” loghozamot jelent. Az összeadhatóság miatt lesznek az alábbi skálázási szabályok ilyen egyszerűek.

## Várható érték és szórás

Tekintsük az egy időszakra eső hozamot $r$ valószínűségi változónak. A **várható értéke** $\mathbb{E}[r]$ az az átlagos hozam, amelyet sok ismétlés során látnánk. A **szórása** azt méri, mekkora jellemzően az eltérés ettől az átlagtól:

$$
\operatorname{sd}(r) = \sqrt{\operatorname{Var}(r)}, \qquad \operatorname{Var}(r) = \mathbb{E}\big[(r - \mathbb{E}[r])^2\big].
$$

$n$ megfigyelt hozamból, $r_1, \dots, r_n$, ezeket így becsüljük:

$$
\bar r = \frac{1}{n}\sum_{i=1}^{n} r_i, \qquad s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (r_i - \bar r)^2}.
$$

Példa: négy napi hozam, $2\%$, $-1\%$, $3\%$ és $-2\%$. Az átlag $\bar r = 0{,}5\%$. Az eltérések (százalékban) $1{,}5$, $-1{,}5$, $2{,}5$ és $-2{,}5$, négyzetösszegük 17, így $s = \sqrt{17/3} \approx 2{,}38\%$ naponta.

## Volatilitás

A **volatilitás**, $\sigma$, a loghozamok évesített szórása. Egy $\sigma = 20\%$-os részvény éves loghozama jellemzően nagyjából 20 százalékponton belül marad a várható értékétől. A volatilitás azt méri, mennyire bizonytalan a kimenet, nem azt, hogy merre mozdul az ár.

> A $\sigma$ volatilitás a loghozamok évesített szórása. A $\mu$ drift a loghozamok évesített várható értéke.

## Évesítés és a négyzetgyökös időszabály

A hozamokat naponta vagy havonta mérjük, a $\mu$-t és a $\sigma$-t viszont évre vetítve adjuk meg. Az átváltáshoz két feltevés kell: a nem átfedő időszakok hozamai **függetlenek**, és mind **azonos eloszlásúak**. Osszunk fel egy $T$ éves időtávot $n$ darab $\Delta t = T/n$ hosszú időszakra; mindegyik várható értéke $\mu\,\Delta t$, varianciája $\sigma^2\Delta t$. A teljes loghozam az időszaki hozamok összege, ezért

$$
\mathbb{E}\Big[\sum_{i=1}^n r_i\Big] = n\,\mu\,\Delta t = \mu T, \qquad \operatorname{Var}\Big(\sum_{i=1}^n r_i\Big) = n\,\sigma^2\Delta t = \sigma^2 T.
$$

A varianciák a függetlenség miatt adódnak össze. Gyököt vonva kapjuk a **négyzetgyökös időszabályt**:

$$
\operatorname{sd}(T \text{ alatti hozam}) = \sigma\sqrt{T}.
$$

A várható érték $T$-vel arányosan nő, a szórás csak $\sqrt{T}$-vel arányosan. Évi kb. 252 kereskedési nappal számolva az $1{,}2\%$-os napi szórás $1{,}2\% \times \sqrt{252} \approx 19{,}0\%$-os éves volatilitásnak felel meg. Visszafelé: évi $\sigma = 20\%$ havonta $20\% / \sqrt{12} \approx 5{,}8\%$-ot jelent.

### Kidolgozott példa: Négy havi hozamból éves várható érték és volatilitás

1. Négy havi loghozam: $1\%$, $-2\%$, $3\%$ és $2\%$. Az átlaguk az összegük negyede.
   $$\bar r = \tfrac{1}{4}(1 - 2 + 3 + 2)\%$$ → **1%**
2. Az átlagtól vett eltérések $0$, $-3$, $2$ és $1$; négyzetösszegük 14. Osszuk el $n - 1 = 3$-mal, és vonjunk gyököt.
   $$s = \sqrt{14/3}\,\%$$ → **2.16%**
3. A várható érték az idővel arányosan nő: egy évben tizenkét hónap van.
   $$\mu = 12\,\bar r$$ → **12%**
4. A szórás az idő négyzetgyökével nő.
   $$\sigma = \sqrt{12}\,s$$ → **7.48%**

## A normális eloszlás mint első modell

Egyszerű első modellként feltesszük, hogy a $T$ év alatti loghozam **normális eloszlású**:

$$
\ln\frac{S_T}{S_0} \sim N\big(\mu T,\ \sigma^2 T\big).
$$

Ez az előző szakasz után kézenfekvő: a teljes loghozam sok kicsi, független tag összege, az ilyen összegek pedig közelítőleg normális eloszlásúak (centrális határeloszlás-tétel). Normális változónál a kimenetek kb. 68%-a esik a várható érték körüli egy szórásnyi sávba, és kb. 95%-a a kétszórásnyiba.

Példa: $\mu = 8\%$, $\sigma = 20\%$ és $T = 4$ év mellett a várható loghozam $\mu T = 0{,}32$, a szórás $\sigma\sqrt{T} = 0{,}40$. Az egyszórásnyi sáv $-0{,}08$ és $0{,}72$ között van. Árfolyamban kifejezve egy 100-ról induló részvény nagyjából három esetből kettőben $100\,e^{-0{,}08} \approx 92{,}3$ és $100\,e^{0{,}72} \approx 205{,}4$ között végez.

A valódi hozamok eloszlásának vastagabb a farka, mint a normális eloszlásnak: a nagy elmozdulások gyakrabban fordulnak elő, mint ahogy az előre jelzi. A modell ennek ellenére a szokásos kiindulópont, és a későbbi leckék erre építenek.

Az ábra a $\mu T$ várható kumulált loghozamot mutatja 10 évig terjedő időtávokra, a $\mu T \pm \sigma\sqrt{T}$ és $\mu T \pm 2\sigma\sqrt{T}$ sávokkal együtt. Növeld a $\sigma$-t, és figyeld meg, hogy a sávok kiszélesednek, a középvonal viszont nem mozdul. Rövid távon a sávok elnyomják a driftet; a vonal csak hosszú távon távolodik el a nullától a sávok szélességéhez képest.

*[Interaktív ábra: volatility horizon](https://quantsandbox.dev/hu/guide/portfolio/returns-volatility)*

## Összefoglalás

- Nem az árfolyamot, hanem a hozamot modellezzük. Az $\ln(S_t/S_{t-1})$ loghozamok egymást követő időszakokra összeadódnak.
- A $\sigma$ volatilitás a loghozamok évesített szórása, a $\mu$ az évesített várható értékük.
- Független, azonos eloszlású hozamoknál a várható érték $\mu T$-ként, a szórás $\sigma\sqrt{T}$-ként nő.
- Első modellként $\ln(S_T/S_0)$ normális eloszlású, $\mu T$ várható értékkel és $\sigma^2 T$ varianciával.

> A következő lecke („Diverzifikáció és korreláció”) több eszközt kombinál, és megmutatja, hogyan adódnak össze a volatilitásaik. Hogy honnan jön a $\sqrt{T}$, azt a Sztochasztikus modellek sorozat első leckéje, a „Véletlen bolyongás és Brown-mozgás” mutatja meg.

[Becsülj várható hozamot, volatilitást és kockázat–hozam viszonyt a Kockázat és hozam laborban](https://quantsandbox.dev/hu/risk-return)

## Interaktív laborok

- [Tőkeallokációs egyenes és Sharpe-mutató](https://quantsandbox.dev/hu/risk-return)

## Gyakorló kérdések

### 1. Egy részvény 100-ról 50-re esik. Hogyan viszonyul egymáshoz az egyszerű hozama és a loghozama?

- a) Mindkettő $-50\%$
- b) A loghozam negatívabb
- c) Az egyszerű hozam negatívabb
- d) A loghozam $+69{,}3\%$

**Válasz:** b) A loghozam negatívabb

Az egyszerű hozam $50/100 - 1 = -50\%$, a loghozam $\ln 0{,}5 \approx -69{,}3\%$. Nagy eséseknél a logaritmus messzebbre megy nulla alá, mint $R$.

### 2. Egy részvény napi loghozamainak szórása 1,2%. Évi 252 kereskedési nappal számolva mekkora az éves volatilitása, százalékban?

**Válasz:** 19.05%

$\sigma = 1{,}2\% \times \sqrt{252} \approx 1{,}2\% \times 15{,}875 \approx 19{,}05\%$. A szórás az idő négyzetgyökével arányos, nem az idővel.

---

Forrás: https://quantsandbox.dev/hu/guide/portfolio/returns-volatility

Következő lecke: [Diverzifikáció és korreláció](https://quantsandbox.dev/hu/guide/portfolio/diversification)
