# Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek

Hosszú távú szinthez húzott folyamat, egzakt megoldása és stacionárius eloszlása, valamint a rövid kamat a Vasicek-modellben.

A „Véletlen bolyongás és Brown-mozgás” lecke Brown-mozgása és a rá épülő részvényár-modell korlátlanul elvándorolhat: a varianciájuk az időtávval nő, és semmi sem húzza vissza őket. A kamatlábak, a volatilitás és a hitelfelárak másképp viselkednek. Ingadoznak, de évek alatt jellemzően visszatérnek egy szokásos szintre. Ez a lecke felépíti az ilyen folyamatok standard modelljét, „Az Itô-lemma” eszközeivel pontosan megoldja, majd a Vasicek-modellben a rövid kamatlábra alkalmazza.

## Az Ornstein–Uhlenbeck-folyamat

Legyen $X_t$ a vizsgált mennyiség, például egy kamatláb. Az **Ornstein–Uhlenbeck-folyamat** az alábbi Itô-folyamat:

$$
dX_t = \kappa\,(\theta - X_t)\,dt + \sigma\,dW_t,
$$

három állandó paraméterrel:

- $\theta$ a **hosszú távú szint**, amely felé a folyamatot húzza a drift.
- $\kappa > 0$ a **visszahúzási sebesség**: időegységenként mennyire zárja a $\theta - X_t$ rést.
- $\sigma > 0$ a volatilitás: a véletlen sokkok mérete, ahogy „Az Itô-lemma” leckében.

A drift előjele a rés előjele. $\theta$ fölött a drift negatív és lefelé tolja a folyamatot, $\theta$ alatt pozitív és felfelé. Gondolj egy rugóra kötött golyóra, amelyet folyamatosan véletlen lökések érnek: minél messzebb kerül a nyugalmi helyzetétől, annál erősebben húzza vissza a rugó. A geometriai Brown-mozgással ellentétben itt a volatilitás nem függ a szinttől, a sokkok mindenhol ugyanakkorák. Ezt a viselkedést nevezzük **átlaghoz való visszahúzásnak**.

## A determinisztikus rész

Kapcsoljuk ki a zajt, $\sigma = 0$. Ekkor a $dx/dt = \kappa(\theta - x)$ közönséges differenciálegyenletet kapjuk, amelynek megoldása

$$
x(t) = \theta + (x_0 - \theta)\,e^{-\kappa t}.
$$

A $\theta$-tól való távolság exponenciálisan csökken. Azt az időt, amely után a rés fele marad meg, az $e^{-\kappa t} = 1/2$ egyenlet adja; ez a **felezési idő**:

$$
t_{1/2} = \frac{\ln 2}{\kappa}.
$$

Nem függ a rés nagyságától. $\kappa = 0{,}5$ mellett a felezési idő $\ln 2 / 0{,}5 \approx 1{,}39$ év, $\kappa = 5$ mellett nagyjából 35 kereskedési nap.

## Egzakt megoldás

A fogás az, hogy változócserével eltüntetjük a $\theta$ felé húzó tagot. Alkalmazzuk az Itô-lemmát az $Y_t = f(t, X_t) = e^{\kappa t} X_t$ folyamatra, ahol $\partial f/\partial t = \kappa e^{\kappa t} x$, $\partial f/\partial x = e^{\kappa t}$ és $\partial^2 f/\partial x^2 = 0$. Mivel a második derivált nulla, Itô-korrekció nincs:

$$
dY_t = \kappa e^{\kappa t} X_t\,dt + e^{\kappa t}\big(\kappa(\theta - X_t)\,dt + \sigma\,dW_t\big) = \kappa\theta\,e^{\kappa t}\,dt + \sigma e^{\kappa t}\,dW_t.
$$

Az $X_t$-t tartalmazó tagok kiesnek, a jobb oldal már nem függ $Y$-tól. Összegezzük a növekményeket a $[0, t]$ intervallumon:

$$
e^{\kappa t} X_t = X_0 + \theta\,\big(e^{\kappa t} - 1\big) + \sigma \int_0^t e^{\kappa s}\,dW_s.
$$

$e^{-\kappa t}$-vel szorozva kapjuk a megoldást:

$$
X_t = \theta + (X_0 - \theta)\,e^{-\kappa t} + \sigma \int_0^t e^{-\kappa (t-s)}\,dW_s.
$$

Az első két tag a fenti determinisztikus pálya. Az integrál összegzi a sokkokat, mindegyiket $e^{-\kappa(t-s)}$ súllyal: a régen történt sokkot a folyamat már nagyrészt visszahúzta, ezért alig számít.

## Várható érték, variancia és stacionárius eloszlás

Egy determinisztikus függvény $dW$ szerinti integrálja nulla várható értékű normális változó, és az **Itô-izometria** szerint a varianciája a súly négyzetének integrálja: $\operatorname{Var}\big(\int_0^t g(s)\,dW_s\big) = \int_0^t g(s)^2\,ds$. A $g(s) = \sigma e^{-\kappa(t-s)}$ választással

$$
\mathbb{E}[X_t] = \theta + (X_0 - \theta)\,e^{-\kappa t}, \qquad \operatorname{Var}(X_t) = \frac{\sigma^2}{2\kappa}\big(1 - e^{-2\kappa t}\big).
$$

$X_t$ tehát minden $t$-re normális eloszlású. Ha $t \to \infty$, a várható érték $\theta$-hoz tart, a variancia pedig korlátos marad. A Brown-mozgás $\sigma^2 t$ varianciája ezzel szemben a végtelenségig nő.

> Az Ornstein–Uhlenbeck-folyamat stacionárius eloszlása: $X_\infty \sim N\big(\theta,\ \sigma^2/(2\kappa)\big)$. Gyorsabb visszahúzás (nagyobb $\kappa$) szűkebb hosszú távú szóródást jelent $\theta$ körül.

## Egzakt szimuláció és az AR(1) alak

Ugyanez a számolás egyetlen $\Delta t$ hosszú lépésre, az aktuális értékből indulva, diszkretizációs hiba nélküli, egzakt szimulációs sémát ad. Minden lépésben egy független $Z \sim N(0,1)$ húzással:

$$
X_{t+\Delta t} = \theta + (X_t - \theta)\,e^{-\kappa\Delta t} + \sigma\sqrt{\frac{1 - e^{-2\kappa\Delta t}}{2\kappa}}\;Z.
$$

Rögzített lépésközzel mintavételezve a folyamat elsőrendű autoregresszió, AR(1): $X_{n+1} = a + \phi X_n + \varepsilon_{n+1}$, ahol $\phi = e^{-\kappa\Delta t}$ és $a = \theta(1 - \phi)$. A megfigyelt értékeket az előző értékükre regresszálva így megbecsülhetők a paraméterek: $\kappa = -\ln\phi / \Delta t$ és $\theta = a/(1-\phi)$.

## Számpélda

Legyen $\kappa = 0{,}5$, $\theta = 4\%$, $\sigma = 1\%$, a kezdőszint $X_0 = 8\%$, az idő években mérve.

- Felezési idő: $\ln 2 / 0{,}5 \approx 1{,}39$ év.
- 1 év után: várható érték $4\% + 4\% \cdot e^{-0{,}5} \approx 6{,}43\%$, szórás $0{,}01\sqrt{(1 - e^{-1})/1} \approx 0{,}80\%$.
- 5 év után: várható érték $4\% + 4\% \cdot e^{-2{,}5} \approx 4{,}33\%$, szórás $\approx 0{,}997\%$.
- Stacionárius szórás: $\sigma/\sqrt{2\kappa} = 0{,}01/\sqrt{1} = 1\%$.

Öt év után a kezdőszint szinte teljesen feledésbe merül: a várható érték közel van $\theta$-hoz, a szórás pedig már a hosszú távú értékének 99,7%-a.

Az ábrán $\theta = 4\%$ és $\sigma = 1\%$ rögzített, az időtáv 5 év. Csúszkákkal a $\kappa$ visszahúzási sebesség (0,1 és 5 között) és az $X_0$ kezdőszint (0% és 10% között) állítható, az „Új pályák” gomb új pályákat sorsol. A grafikon több szimulált pályát, a $\theta + (X_0 - \theta)e^{-\kappa t}$ várható pályát és a $\pm 2$ szórásnyi sávokat mutatja. A kijelzők a felezési időt, a $\sigma/\sqrt{2\kappa}$ stacionárius szórást, az 5 év utáni várható szintet és a Vasicek-modell 5 éves zérókupon-hozamát adják $r_0 = X_0$ mellett. Növeld $\kappa$-t: a pályák $\theta$-hoz tapadnak, a sáv szűkül; vidd 0,1 felé, és a pályák szinte Brown-mozgásnak látszanak. Aztán indítsd a folyamatot $\theta$-tól messze, 0%-ról vagy 10%-ról, és figyeld a várható pálya lecsengését.

*[Interaktív ábra: ou paths](https://quantsandbox.dev/hu/guide/stochastic/mean-reversion)*

## A Vasicek-modell

A **rövid kamatláb** $r_t$ egy pillanatnyi időtartamra szóló hitel folytonos kamatlába. A **Vasicek-modell** feltevése, hogy a $\mathbb{Q}$ kockázatsemleges mérték alatt Ornstein–Uhlenbeck-folyamatot követ: $dr_t = \kappa(\theta - r_t)\,dt + \sigma\,dW_t$. Egy **zérókupon-kötvény** a $T$ időpontban 1-et fizet, ára pedig a rövid kamat véletlen pályája menti diszkontfaktor várható értéke, $P(0,T) = \mathbb{E}^{\mathbb{Q}}\big[e^{-\int_0^T r_s\,ds}\big]$. Mivel egy normális folyamat integrálja is normális, ez a várható érték zárt alakban felírható:

$$
P(0,T) = A(T)\,e^{-B(T)\,r_0}, \qquad B(T) = \frac{1 - e^{-\kappa T}}{\kappa},
$$

$$
\ln A(T) = \left(\theta - \frac{\sigma^2}{2\kappa^2}\right)\big(B(T) - T\big) - \frac{\sigma^2 B(T)^2}{4\kappa}.
$$

$B(T)$ azt méri, mennyit számít a mai rövid kamat: rövid lejáratra közel van $T$-hez, hosszú lejáratra $1/\kappa$-hoz tart, mert $r_0$ hatása elhalványul. A folytonos zérókupon-hozam $y(T) = -\ln P(0,T)/T$.

A fenti példában $r_0 = 8\%$ és $T = 5$ mellett: $B(5) = (1 - e^{-2{,}5})/0{,}5 \approx 1{,}836$, $A(5) \approx 0{,}8815$, így $P(0,5) \approx 0{,}8815\,e^{-1{,}836 \cdot 0{,}08} \approx 0{,}7611$, az 5 éves hozam pedig $-\ln(0{,}7611)/5 \approx 5{,}46\%$. A hozam $r_0$ és $\theta$ közé esik, mert a piac a kamat 4% felé való visszatérésére számít.

$T$ növelésével a hozam $\theta - \sigma^2/(2\kappa^2)$-hez tart, itt $3{,}98\%$-hoz. Ha $r_0$ ez alatt van, a modell emelkedő görbét ad, ha fölötte, akkor fordított (csökkenő) görbét, közvetlenül fölötte pedig enyhén púpos, előbb kissé emelkedő, majd csökkenő görbét. Az „Azonnali kamatok, forward kamatok és a hozamgörbe” lecke ezeket az alakokat a piacon megfigyelhető formában mutatja be; a Vasicek-modell csak ezt a néhány alakot tudja előállítani, ezért a gyakorlatban a görbét gyakran közvetlenül, rugalmasabb függvénnyel illesztik. Ilyen piaci görbéket a Hozamgörbe labor mutat.

A modell fő hátránya, hogy a normális eloszlású rövid kamat pozitív valószínűséggel negatívvá válhat. A Cox–Ingersoll–Ross- (CIR-) modell ezt úgy kerüli el, hogy a volatilitást $\sqrt{r_t}$-vel arányosnak veszi.

### Kidolgozott példa: Az OU-eloszlás egy év után

1. $\kappa = 0{,}5$, $\theta = 4\%$, $X_0 = 8\%$ mellett a várható szint egy év után (%-ban).
   $$\theta + (X_0 - \theta)e^{-\kappa} = 4 + 4e^{-0{,}5}$$ → **6.43**
2. A szórás egy év után $\sigma = 1\%$ mellett (%-ban).
   $$\sigma\sqrt{\frac{1 - e^{-2\kappa}}{2\kappa}} = 1 \cdot \sqrt{1 - e^{-1}}$$ → **0.795**
3. A várható eltérés felezési ideje, években.
   $$t_{1/2} = \ln 2/\kappa$$ → **1.386**

## Összefoglalás

- A $dX = \kappa(\theta - X)\,dt + \sigma\,dW$ Ornstein–Uhlenbeck-folyamatot $\kappa$ sebességgel húzza a $\theta$ hosszú távú szint; a várható rés $\ln 2/\kappa$ időnként feleződik.
- Az Itô-lemmát $e^{\kappa t}X_t$-re alkalmazva kapjuk az egzakt megoldást; $X_t$ normális, várható értéke $\theta + (X_0 - \theta)e^{-\kappa t}$, varianciája $\tfrac{\sigma^2}{2\kappa}(1 - e^{-2\kappa t})$.
- A variancia korlátos marad, a stacionárius eloszlás $N(\theta, \sigma^2/(2\kappa))$; rögzített lépésközzel mintavételezve a folyamat AR(1).
- A Vasicek-modellben a rövid kamat OU-folyamat, és $P(0,T) = A(T)e^{-B(T)r_0}$, ahol $B(T) = (1 - e^{-\kappa T})/\kappa$; a kamat negatívvá válhat.

[Szimulálj Itô-folyamatokat, és hasonlítsd össze a driftjüket és szóródásukat az Itô-folyamat laborban](https://quantsandbox.dev/hu/ito-process)

## Interaktív laborok

- [Itô-lemma vizualizáció: a −½σ² driftkorrekció](https://quantsandbox.dev/hu/ito-process)
- [Hozamgörbe-bootstrapping, spot és forward kamatlábak](https://quantsandbox.dev/hu/yield-curve)

## Gyakorló kérdések

### 1. Egy kamatláb $\kappa = 2$ (évente) paraméterű Ornstein–Uhlenbeck-folyamatot követ. Hány év alatt feleződik meg a $\theta$-tól való várható eltérés?

**Válasz:** 0.347 év

$t_{1/2} = \ln 2/\kappa = 0{,}693/2 \approx 0{,}347$ év, valamivel több mint négy hónap, akármekkora is az eltérés.

### 2. Kétszeresére növeljük a visszahúzás $\kappa$ sebességét, $\sigma$ változatlan. Mi történik a stacionárius eloszlás szórásával?

- a) A kétszeresére nő.
- b) A felére csökken.
- c) A $\sqrt{2}$-ed részére csökken.
- d) Nem változik.

**Válasz:** c) A $\sqrt{2}$-ed részére csökken.

A stacionárius variancia $\sigma^2/(2\kappa)$, a szórás tehát $\sigma/\sqrt{2\kappa}$. Ha $\kappa$ kétszeres, a szórás $\sqrt{2}$-vel osztódik: az erősebb visszahúzás közelebb tartja a folyamatot $\theta$-hoz.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/mean-reversion

Előző lecke: [Korrelált Brown-mozgások és többeszközös modellek](https://quantsandbox.dev/hu/guide/stochastic/correlated-brownian-motions)

Következő lecke: [Ugrások és a Merton-féle ugró diffúzió](https://quantsandbox.dev/hu/guide/stochastic/jump-diffusion)
