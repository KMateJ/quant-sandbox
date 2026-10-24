# Kolmogorov-egyenletek és a Feynman–Kac-formula

A diffúzió generátora, a visszafelé egyenlet, és hogyan lesz egy várható érték egy PDE megoldása.

Egy ár felírható diszkontált várható értékként, ahogy a „Mértékcsere és a Girsanov-tétel” című leckében, vagy egy parciális differenciálegyenlet megoldásaként. Ez a lecke bebizonyítja, hogy a két leírás ugyanazt adja. Felhasználja „Az Itô-lemma” Itô-formuláját, „Az Itô-integrál” martingáltulajdonságát és a „Feltételes várható érték és martingálok” feltételes várható értékeit.

## Diffúziók és generátoruk

Legyen $X$ a következő sztochasztikus differenciálegyenlet megoldása:

$$
dX_s = \mu(X_s)\,ds + \sigma(X_s)\,dW_s,
$$

ahol $W$ Brown-mozgás, a $\mu, \sigma : \mathbb{R} \to \mathbb{R}$ együtthatók pedig Lipschitz-folytonosak. Ekkor az egyenletnek minden kezdőpontból egyértelmű megoldása van, és $X$ Markov-folyamat: $X_t$ ismeretében $X$ jövője nem függ a korábbi pályától. Jelölje $\mathbb{E}_{t,x}[\,\cdot\,] = \mathbb{E}[\,\cdot \mid X_t = x]$.

$X$ **generátora** az az operátor, amely megadja $f(X)$ várható változási ütemét egy pontban. Kétszer folytonosan differenciálható, kompakt tartójú $f$-re

$$
\mathcal{L}f(x) = \lim_{h \downarrow 0} \frac{\mathbb{E}_{0,x}[f(X_h)] - f(x)}{h}.
$$

Ezt az Itô-lemmával számolhatjuk ki. A $df(X_s)$ differenciált a $[0, h]$ intervallumon integrálva

$$
f(X_h) = f(x) + \int_0^h \Big(\mu f' + \tfrac12 \sigma^2 f''\Big)(X_s)\,ds + \int_0^h \sigma(X_s) f'(X_s)\,dW_s.
$$

A $\sigma f'$ integrandus korlátos $f$ tartóján, így az Itô-integrál várható értéke nulla. Várható értéket véve, $h$-val osztva és $h \to 0$ határátmenettel (a $ds$-integrandus folytonos)

$$
\mathcal{L}f(x) = \mu(x)\,f'(x) + \tfrac12\,\sigma^2(x)\,f''(x).
$$

A drift elsőrendű, a diffúzió másodrendű deriválttagot ad; a $\tfrac12\sigma^2$ az Itô-korrekció. Példák: a $\sigma$ volatilitású Brown-mozgásra $\mathcal{L} = \tfrac12\sigma^2\,\partial_{xx}$; a geometriai Brown-mozgásra $\mathbb{Q}$ alatt $\mathcal{L}f = rx\,f' + \tfrac12\sigma^2 x^2 f''$. Ugyanez a számolás határátmenet nélkül a **Dynkin-formulát** adja: $\mathbb{E}_{0,x}[f(X_t)] = f(x) + \mathbb{E}_{0,x}\big[\int_0^t \mathcal{L}f(X_s)\,ds\big]$.

## A Kolmogorov-féle visszafelé egyenlet

Rögzítsünk egy $T$ időhorizontot és egy $g$ kifizetésfüggvényt, és legyen $v(t, x) = \mathbb{E}_{t,x}[g(X_T)]$. A Markov-tulajdonság miatt $t \le s \le T$ esetén $v(s, X_s) = \mathbb{E}[g(X_T) \mid \mathcal{F}_s]$, tehát $s \mapsto v(s, X_s)$ martingál. Ha $v$ $t$-ben egyszer, $x$-ben kétszer differenciálható, az Itô-lemma szerint

$$
dv(s, X_s) = \big(\partial_s v + \mathcal{L}v\big)(s, X_s)\,ds + \sigma(X_s)\,\partial_x v(s, X_s)\,dW_s.
$$

Nem létezhet olyan folytonos martingál, amelynek $ds$-része nem azonosan nulla, mert egy korlátos változású folyamat, amely egyben folytonos martingál, konstans. A $ds$-tagnak tehát el kell tűnnie, és ez a **Kolmogorov-féle visszafelé egyenlet**:

$$
\partial_t v + \mathcal{L}v = 0 \quad \text{a } [0, T) \times \mathbb{R} \text{ halmazon}, \qquad v(T, x) = g(x).
$$

Az egyenlet visszafelé halad: a végfeltétel $T$-ben adott, és $t = 0$ felé oldjuk meg. Ha $X$-nek van $p(t, x; T, y)$ átmenetisűrűsége, az $(t, x)$-ben a visszafelé egyenletet teljesíti, a $(T, y)$ előre mutató változókban pedig a **Kolmogorov-féle előre** (Fokker–Planck-) **egyenletet**:

$$
\partial_T p = -\partial_y\big(\mu(y)\,p\big) + \tfrac12\,\partial_{yy}\big(\sigma^2(y)\,p\big).
$$

A visszafelé egyenlet azt írja le, hogyan függ egy várható kifizetés a kezdőponttól; az előre egyenlet azt, hogyan terül szét a valószínűségi tömeg egy rögzített kezdőpontból.

## A Feynman–Kac-tétel

Vegyünk hozzá egy folytonos $r(x) \ge 0$ diszkontrátát. **Tétel (Feynman–Kac).** Legyenek $\mu, \sigma$ Lipschitz-folytonosak, és $u(t, x)$, amely $t$-ben egyszer, $x$-ben kétszer folytonosan differenciálható, oldja meg a

$$
\partial_t u + \mu(x)\,\partial_x u + \tfrac12\sigma^2(x)\,\partial_{xx} u - r(x)\,u = 0 \quad \text{a } [0, T) \times \mathbb{R} \text{ halmazon}, \qquad u(T, x) = g(x)
$$

feladatot. Tegyük fel továbbá, hogy $\mathbb{E}_{t,x}\big[\int_t^T \big(\sigma(X_s)\,\partial_x u(s, X_s)\big)^2 ds\big] < \infty$, ami teljesül például akkor, ha $\sigma\,\partial_x u$ korlátos. Ekkor

$$
u(t, x) = \mathbb{E}_{t,x}\!\left[ e^{-\int_t^T r(X_s)\,ds}\, g(X_T) \right].
$$

**Bizonyítás.** Rögzítsük $(t, x)$-et, és legyen $s \in [t, T]$ esetén $D_s = e^{-\int_t^s r(X_v)\,dv}$ és $Y_s = D_s\,u(s, X_s)$. A $D$ tényező korlátos változású, $dD_s = -r(X_s)\,D_s\,ds$, így a szorzatszabályban nincs vegyes tag. Az $u(s, X_s)$-re alkalmazott Itô-lemmával

$$
dY_s = D_s\big(\partial_s u + \mathcal{L}u - r u\big)(s, X_s)\,ds + D_s\,\sigma(X_s)\,\partial_x u(s, X_s)\,dW_s = D_s\,\sigma(X_s)\,\partial_x u(s, X_s)\,dW_s.
$$

A $ds$-tag nulla, mert $u$ megoldja az egyenletet. Mivel $0 < D_s \le 1$, az integrálhatósági feltétel miatt $Y$ egy $\mathcal{L}^2$-beli integrandus Itô-integrálja, tehát martingál. Így $u(t, x) = Y_t = \mathbb{E}_{t,x}[Y_T] = \mathbb{E}_{t,x}\big[D_T\,g(X_T)\big]$, felhasználva, hogy $u(T, \cdot) = g$. $\square$

A bizonyítás az egyértelműséget is megadja: az integrálhatósági osztályba eső két megoldás ugyanazzal a várható értékkel egyenlő. A fordított irányhoz, hogy a várható érték elég sima ahhoz, hogy megoldja az egyenletet, több kell, például sima együtthatók és nullától elválasztott $\sigma$; ilyen feltételek mellett a várható érték a megoldás. Gondoljunk $u(s, X_s)$-re úgy, mint a pálya mentén vitt igazságos értékre: diszkontálva sem fel, sem le nem sodródik, ezért mai értéke a lejáratkori diszkontált érték várható értéke.

> Feynman–Kac: a $\partial_t u + \mathcal{L}u - ru = 0$, $u(T, \cdot) = g$ feladat megoldása $u(t, x) = \mathbb{E}_{t,x}\big[e^{-\int_t^T r(X_s)ds} g(X_T)\big]$. A bizonyítás az Itô-lemma, plusz az, hogy egy $dW$ szerinti integrál martingál.

## A hővezetési egyenlet

Legyen $\mu = 0$, $\sigma$ konstans és $r = 0$. Ekkor $X_T = x + \sigma(W_T - W_t)$, és a $\tau = T - t$ hátralévő futamidővel a tétel így szól:

$$
\partial_\tau u = \tfrac12\sigma^2\,\partial_{xx} u, \quad u(0, x) = g(x) \qquad \Longrightarrow \qquad u(\tau, x) = \mathbb{E}\big[g(x + \sigma W_\tau)\big] = \int_{\mathbb{R}} g(y)\,\frac{1}{\sqrt{2\pi\sigma^2\tau}}\,e^{-\frac{(y - x)^2}{2\sigma^2\tau}}\,dy.
$$

Ez a hővezetési egyenlet, a megoldás pedig a kifizetés $\sigma^2\tau$ varianciájú Gauss-maggal simított változata. A mag deriválásával ellenőrizhető, hogy megoldja az egyenletet. Három kifizetésnek zárt alakja van, $s = \sigma\sqrt{\tau}$ és $d = (x - 1)/s$ jelöléssel:

- Négyzet, $g(x) = x^2$: $u = x^2 + \sigma^2\tau$. Ellenőrzés: $\partial_\tau u = \sigma^2$ és $\tfrac12\sigma^2\,\partial_{xx}u = \tfrac12\sigma^2 \cdot 2 = \sigma^2$.
- Digitális, $g(x) = \mathbf{1}\{x > 1\}$: $u = \Phi(d)$, annak valószínűsége, hogy $x + \sigma W_\tau$ 1 fölött végez.
- Call, $g(x) = (x - 1)^+$: $u = (x - 1)\,\Phi(d) + s\,\varphi(d)$, a nulla kamatú Bachelier-ár.

Számpélda $x = 1$-ben, $\tau = 0{,}5$ és $\sigma = 1$ mellett, így $s = \sqrt{0{,}5} \approx 0{,}7071$ és $d = 0$: a call értéke $s\,\varphi(0) = 0{,}7071 \times 0{,}3989 \approx 0{,}2821$, a digitálisé $\Phi(0) = 0{,}5$, a négyzeté $1 + 0{,}5 = 1{,}5$. A $W_\tau$ 2000 húzásából számolt Monte Carlo-becslés standard hibája a kifizetés szórása osztva $\sqrt{2000}$-rel: a callnál kb. $0{,}4128/44{,}72 \approx 0{,}0092$, a digitálisnál $0{,}5/44{,}72 \approx 0{,}0112$, a négyzetnél $\sqrt{2{,}5}/44{,}72 \approx 0{,}0354$.

Az ábra ezt a hővezetési egyenletet oldja meg a választott kifizetésre: call $(x - 1)^+$, digitális $\mathbf{1}\{x > 1\}$ vagy négyzet $x^2$. Az $x$ függvényében, $-2$-től $4$-ig mutatja a $g$ kifizetést (szaggatott), a Gauss-integrálból adódó pontos $u(\tau, x)$ megoldást (vonal) és 13 $x$ pontban egy-egy 2000 húzásos Monte Carlo-becslést (pontok). Növeld $\tau$-t vagy $\sigma$-t, és figyeld meg, hogy a call töréspontja és a digitális ugrása egyre jobban kisimul, a négyzet pedig $\sigma^2\tau$-val feljebb tolódik. A pontok mintavételi zajon belül a vonalon maradnak. Az $x = 1$-beli kijelzők a pontos $u$-t, a Monte Carlo-becslést és annak standard hibáját mutatják.

*[Interaktív ábra: feynman kac](https://quantsandbox.dev/hu/guide/stochastic/feynman-kac)*

## A Black–Scholes-egyenlet

A „Mértékcsere és a Girsanov-tétel” szerint $\mathbb{Q}$ alatt a részvény a $dS_s = rS_s\,ds + \sigma S_s\,d\tilde W_s$ egyenletet követi konstans $r$ és $\sigma$ mellett, egy $g(S_T)$ kifizetés ára pedig $V(t, S) = \mathbb{E}^{\mathbb{Q}}_{t,S}\big[e^{-r(T - t)} g(S_T)\big]$. Ez egy Feynman–Kac-típusú várható érték $\mu(S) = rS$, $\sigma(S) = \sigma S$ együtthatókkal és konstans $r$ diszkontrátával, ezért $V$ megoldja a **Black–Scholes-egyenletet**:

$$
\frac{\partial V}{\partial t} + rS\,\frac{\partial V}{\partial S} + \frac{1}{2}\sigma^2 S^2\,\frac{\partial^2 V}{\partial S^2} - rV = 0, \qquad V(T, S) = g(S).
$$

Callra $g(S) = (S - K)^+$, és a várható érték „A Black–Scholes-képlet” című lecke képlete. A valós $\mu$ drift sehol sem jelenik meg, mert a generátort $\mathbb{Q}$ alatt vesszük. Az $x = \ln S$ helyettesítés a generátort az $(r - \tfrac12\sigma^2)\,\partial_x + \tfrac12\sigma^2\,\partial_{xx}$ konstans együtthatós alakra hozza; a drift és a diszkontálás eltávolítása után az egyenlet a hővezetési egyenlet lesz, ezért épül a Black–Scholes-képlet az $N(\cdot)$ normális eloszlásfüggvényre.

Numerikus ellenőrzés $S = K = 100$, $r = 5\%$, $\sigma = 20\%$, $T = 1$ mellett: a call ára $C = 10{,}4506$, $\Delta = N(d_1) = 0{,}6368$, $\Gamma = 0{,}018762$ és $\partial C/\partial t = -6{,}4140$. Az egyenlet tagjai: $-6{,}4140 + 3{,}1842 + 3{,}7524 - 0{,}5225 = 0{,}0001$, ami kerekítéstől eltekintve nulla.

## Egy szám két kiszámítási módja

A Feynman–Kac-tétel két utat ad ugyanahhoz az árhoz. A **Monte Carlo**-út sok $X$-pályát szimulál $\mathbb{Q}$ alatt, átlagolja a diszkontált kifizetéseket, és olyan standard hibát ad, amely a pályák $N$ számában $1/\sqrt{N}$ ütemben csökken, $X$ dimenziójától függetlenül. A **PDE**-út rácsra bontja $x$-et és $t$-t, és véges differenciákkal $u(T, \cdot) = g$-ből visszafelé lépteti az egyenletet; egyetlen megoldás minden rácspontban megadja $u$-t, a görögök pedig a szomszédos értékek különbségeiből jönnek, a rács viszont $X$ dimenziójával exponenciálisan nő. A gyakorlatban egy-három állapotváltozóig a PDE-módszerek, fölötte a Monte Carlo dominál. A két válasz közötti bármilyen eltérés numerikus hiba, az egyik oldalon mintavételi, a másikon rácshiba, nem a modell különbsége.

### Kidolgozott példa: A négyzetes kifizetés x = 1-ben

1. $\sigma = 1$ és $\tau = 0{,}5$ mellett a Gauss-mag varianciája $\sigma^2\tau$.
   $$\mathbb{E}[(\sigma W_\tau)^2] = \sigma^2\tau$$ → **0.5**
2. Bontsd ki az $(x + \sigma W_\tau)^2$ négyzetet; a vegyes tag várható értéke nulla.
   $$u(\tau, 1) = 1^2 + 2 \cdot 1 \cdot 0 + 0{,}5$$ → **1.5**
3. Az ábra Monte Carlo-kijelzője $x = 1$-ben ettől legfeljebb egy-két standard hibányira tér el: a kifizetés varianciája 2,5, a húzások száma 2000.
   $$\sqrt{2{,}5}/\sqrt{2000}$$ → **0.0354**

## Összefoglalás

- A $dX = \mu(X)\,ds + \sigma(X)\,dW$ diffúzió generátora $\mathcal{L}f = \mu f' + \tfrac12\sigma^2 f''$, amely az Itô-lemmából számolható.
- $v(t, x) = \mathbb{E}_{t,x}[g(X_T)]$ megoldja a $\partial_t v + \mathcal{L}v = 0$, $v(T, \cdot) = g$ Kolmogorov-féle visszafelé egyenletet; az átmenetisűrűségek $(T, y)$-ban az előre egyenletet teljesítik.
- Feynman–Kac: a $\partial_t u + \mathcal{L}u - ru = 0$, $u(T, \cdot) = g$ feladat megoldása $g(X_T)$ diszkontált várható értéke. Bizonyítás: az $e^{-\int r}u(s, X_s)$ diszkontált értéknek nincs driftje, tehát martingál.
- $\mu = 0$, konstans $\sigma$ és $r = 0$ mellett ez a hővezetési egyenlet, amelyet a kifizetés Gauss-simítása old meg. $\mathbb{Q}$ alatt, GBM-mel a Black–Scholes-egyenlet.
- A Monte Carlo- és a véges differenciás árazás a tétel két oldaláról ugyanazt a számot számolja ki.

> A következő lecke, a „Monte Carlo-opcióárazás”, a várható érték oldalát választja: $\mathbb{Q}$ alatt szimulál lejáratkori árakat, és az átlag standard hibáját vizsgálja.

[Vizsgáld meg, hogyan függ a Black–Scholes-egyenlet megoldása S-től, σ-tól és T-től a Black–Scholes laborban](https://quantsandbox.dev/hu/black-scholes)

## Interaktív laborok

- [Black–Scholes-kalkulátor és opciós görögök](https://quantsandbox.dev/hu/black-scholes)
- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)

## Gyakorló kérdések

### 1. Az Ornstein–Uhlenbeck-folyamat a $dX_s = -\kappa X_s\,ds + \sigma\,dW_s$ egyenlet megoldása. Mi a generátora?

- a) $\mathcal{L}f = -\kappa x\,f' + \tfrac12\sigma^2 f''$
- b) $\mathcal{L}f = -\kappa x\,f' + \sigma f''$
- c) $\mathcal{L}f = -\kappa f' + \tfrac12\sigma^2 x^2 f''$
- d) $\mathcal{L}f = -\kappa x\,f' + \tfrac12\sigma^2 f'' - \kappa f$

**Válasz:** a) $\mathcal{L}f = -\kappa x\,f' + \tfrac12\sigma^2 f''$

$\mu(x) = -\kappa x$ és $\sigma(x) = \sigma$ mellett az $\mathcal{L}f = \mu f' + \tfrac12\sigma^2 f''$ képlet $-\kappa x\,f' + \tfrac12\sigma^2 f''$-t ad. Nulladrendű tag, például $-\kappa f$, csak diszkontálás esetén jelenik meg.

### 2. Oldd meg a $\partial_\tau u = \tfrac12\sigma^2\,\partial_{xx} u$ egyenletet $u(0, x) = x^2$, $\sigma = 0{,}5$ mellett! Mennyi $u(\tau, x)$, ha $\tau = 2$ és $x = 2$?

**Válasz:** 4.5

A Feynman–Kac-tétel szerint $u = \mathbb{E}[(x + \sigma W_\tau)^2] = x^2 + \sigma^2\tau = 4 + 0{,}25 \times 2 = 4{,}5$.

### 3. A Black–Scholes-modellben $S = 100$, $r = 5\%$, $\sigma = 20\%$ mellett egy call ára $C = 10{,}4506$, $\Delta = 0{,}6368$ és $\Gamma = 0{,}018762$. Határozd meg a Black–Scholes-egyenletből $\partial C/\partial t$ értékét (évre vetítve)!

**Válasz:** -6.414

$\partial C/\partial t = rC - rS\Delta - \tfrac12\sigma^2 S^2\Gamma = 0{,}5225 - 3{,}1840 - 3{,}7524 \approx -6{,}414$. Az opció az idő múlásával értéket veszít, a deltája és gammája által meghatározott ütemben.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/feynman-kac

Előző lecke: [Az Itô-lemma](https://quantsandbox.dev/hu/guide/stochastic/ito-lemma)

Következő lecke: [Mértékcsere és a Girsanov-tétel](https://quantsandbox.dev/hu/guide/stochastic/change-of-measure)
