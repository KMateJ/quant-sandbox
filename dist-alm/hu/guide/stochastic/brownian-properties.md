# A Brown-mozgás tulajdonságai

Definíció, Gauss-folyamat jellemzés, skálázás, időinverzió, Markov-tulajdonság, kvadratikus variáció és a pályák szabálytalansága.

A „Véletlen bolyongás és Brown-mozgás” című lecke a Brown-mozgást egy skálázott pénzfeldobásos bolyongás határértékeként kapta meg, és informálisan sorolta fel a tulajdonságait. A „Valószínűségi mezők, σ-algebrák és valószínűségi változók” és a „Filtrációk, adaptált folyamatok és megállási idők” című leckék fogalmaival ez a lecke pontosan kimondja a definíciót, bebizonyítja, hogy a Brown-mozgást a kovarianciafüggvénye jellemzi, és ebből a jellemzésből levezet négy invarianciát, köztük az időinverziót. A végén a fő pályatulajdonságok következnek: rekurrencia, sehol sem differenciálhatóság, végtelen teljes változás, véges kvadratikus variáció, valamint a Markov- és az erős Markov-tulajdonság.

## A Brown-mozgás definíciója

Legyen $(\Omega, \mathcal{F}, \mathbb{P})$ valószínűségi mező. **Standard Brown-mozgásnak** nevezzük az ezen értelmezett $(W_t)_{t \ge 0}$ valószínűségi változó-családot, ha

- $W_0 = 0$ majdnem biztosan;
- minden $0 \le t_0 < t_1 < \cdots < t_n$ esetén a $W_{t_1} - W_{t_0}, \dots, W_{t_n} - W_{t_{n-1}}$ növekmények függetlenek;
- $0 \le s < t$ esetén a $W_t - W_s$ növekmény eloszlása $N(0, t - s)$;
- majdnem minden $\omega \in \Omega$ esetén a $t \mapsto W_t(\omega)$ pálya folytonos.

Hogy ilyen folyamat létezik, az tétel (Wiener, 1923); a szokásos bizonyítás megadja a véges dimenziós eloszlásokat, majd a Kolmogorov-féle folytonossági tétellel folytonos változatot állít elő. Ha adott egy $(\mathcal{F}_t)_{t \ge 0}$ filtráció, akkor $W$ az $(\mathcal{F}_t)$ filtrációra **vonatkozó** Brown-mozgás, ha adaptált, és minden $s < t$ esetén $W_t - W_s$ független $\mathcal{F}_s$-től. Az $\mathcal{F}^W_t = \sigma(W_u : u \le t)$ természetes filtrációra ez a független növekményekből következik.

## A Brown-mozgás mint Gauss-folyamat

Az $(X_t)$ folyamat **Gauss-folyamat**, ha minden $(X_{t_1}, \dots, X_{t_n})$ vektor többdimenziós normális eloszlású. Ekkor az eloszlását az $\mathbb{E}[X_t]$ várhatóérték-függvény és a $\operatorname{Cov}(X_s, X_t)$ kovarianciafüggvény meghatározza, hiszen a többdimenziós normális eloszlást a várhatóérték-vektora és a kovarianciamátrixa meghatározza.

A Brown-mozgás Gauss-folyamat: $(W_{t_1}, \dots, W_{t_n})$ a független, normális növekmények lineáris transzformáltja, mert $W_{t_k} = \sum_{j \le k}(W_{t_j} - W_{t_{j-1}})$. Várható értéke nulla, és $s \le t$ esetén a $W_t = W_s + (W_t - W_s)$ felbontásban a második tag független az elsőtől, így

$$
\operatorname{Cov}(W_s, W_t) = \operatorname{Var}(W_s) + \operatorname{Cov}(W_s, W_t - W_s) = s = \min(s, t).
$$

> Jellemzés: egy folytonos pályájú $(X_t)_{t \ge 0}$ folyamat pontosan akkor standard Brown-mozgás, ha centrált Gauss-folyamat, és $\operatorname{Cov}(X_s, X_t) = \min(s, t)$.

Az egyik irányt az imént láttuk. Megfordítva, legyen $X$ ilyen folyamat. Ekkor $\operatorname{Var}(X_0) = 0$, tehát $X_0 = 0$. Ha $s < t$, akkor $\operatorname{Var}(X_t - X_s) = t - 2s + s = t - s$. Diszjunkt $s < t \le u < v$ intervallumokra

$$
\operatorname{Cov}(X_t - X_s,\, X_v - X_u) = \min(t,v) - \min(t,u) - \min(s,v) + \min(s,u) = t - t - s + s = 0.
$$

A növekmények együttesen normálisak, együttesen normális változóknál pedig a nulla kovariancia függetlenséget jelent. Így mind a négy definiáló tulajdonság teljesül. A gyakorlatban ez azt jelenti, hogy egy transzformált folyamatról elég megmutatni, hogy centrált Gauss-folyamat, kovarianciája $\min(s,t)$, és pályái folytonosak, és máris Brown-mozgás.

## Négy invariancia

Az alábbi transzformációk mindegyike lineáris leképezés $W$-n, így az eredmény ismét centrált Gauss-folyamat; csak a kovarianciát és a folytonosságot kell ellenőrizni. Legyen $c > 0$ és $s \ge 0$ rögzített.

- **Szimmetria.** $X_t = -W_t$. Ekkor nyilvánvalóan $\operatorname{Cov}(X_u, X_v) = \min(u,v)$.
- **Skálázás.** $X_t = c^{-1/2} W_{ct}$. Ekkor $\operatorname{Cov}(X_u, X_v) = c^{-1}\min(cu, cv) = \min(u,v)$. Ha az időt $c$-szeresére gyorsítjuk, a teret pedig $\sqrt{c}$-vel összenyomjuk, ugyanazt a folyamatot kapjuk.
- **Időeltolás.** $X_t = W_{s+t} - W_s$. Ekkor $\operatorname{Cov}(X_u, X_v) = \min(s+u, s+v) - s - s + s = \min(u,v)$. Ráadásul $X$ független $\mathcal{F}_s$-től, mert véges dimenziós vektorai $s$ utáni növekményekből állnak. Ez az **egyszerű Markov-tulajdonság**: bármely rögzített időpont után a folyamat elölről kezdődik, a múlttól függetlenül.
- **Időinverzió.** $X_t = t\,W_{1/t}$, ha $t > 0$, és $X_0 = 0$. Ha $u, v > 0$, akkor $\operatorname{Cov}(X_u, X_v) = uv\min(1/u, 1/v) = uv/\max(u,v) = \min(u,v)$.

Csak az időinverziónál kell a folytonossággal vigyázni. A $(0, \infty)$ intervallumon a $t \mapsto t W_{1/t}$ pálya folytonos; a kérdés az, hogy $X_t \to 0$ teljesül-e, ha $t \downarrow 0$. A pozitív racionális számokra megszorítva $X$ és $W$ véges dimenziós eloszlásai megegyeznek, az $\{X_q \to 0,\ \text{ha } q \downarrow 0,\ q \in \mathbb{Q}\}$ eseményt pedig megszámlálhatóan sok koordináta határozza meg. Valószínűsége ezért ugyanannyi, mint $W$ esetén, vagyis 1. A $(0, \infty)$-en való folytonosság miatt ekkor minden $t$ mentén $X_t \to 0$. Az $u = 1/t$ helyettesítéssel kapjuk a **nagy számok törvényét Brown-mozgásra**:

$$
\lim_{u \to \infty} \frac{W_u}{u} = \lim_{t \downarrow 0} t\,W_{1/t} = 0 \quad \text{majdnem biztosan}.
$$

Az időinverzió felcseréli a pálya $t = 0$ körüli viselkedését a $t \to \infty$ melletti viselkedésével: az egyik végre vonatkozó minden állítás állítást ad a másikról is.

Az ábra egyszerre egy transzformációt alkalmaz friss Brown-pályákra, és 8 transzformált pályát rajzol a $t \in [0, 1]$ intervallumon, a $\pm\sqrt{t}$ és $\pm 2\sqrt{t}$ görbékkel együtt. Válaszd a skálázást, és mozgasd $c$-t 0,25 és 4 között; válaszd az időinverziót, a szimmetriát vagy az időeltolást, és mozgasd $s$-et 0 és 2 között; közben nyomd meg az „Új pályák” gombot. A 2000 pályából számolt kijelzők szerint $X_1$ mintavarianciája 1 közelében, $(X_{0{,}5}, X_1)$ mintakovarianciája pedig $\min(0{,}5;\ 1) = 0{,}5$ közelében marad, bármelyik transzformációt választod is.

*[Interaktív ábra: bm transformations](https://quantsandbox.dev/hu/guide/stochastic/brownian-properties)*

## Kidolgozott példa

Számítsuk ki $\mathbb{P}(W_1 > 0,\ W_2 > 0)$ értékét. A $(W_1, W_2)$ pár kétdimenziós normális, varianciái 1 és 2, kovarianciája $\min(1,2) = 1$, így korrelációja $\rho = 1/\sqrt{2} \approx 0{,}7071$. Centrált kétdimenziós normális párnál annak valószínűsége, hogy mindkét koordináta pozitív, $\tfrac14 + \arcsin(\rho)/(2\pi)$, tehát

$$
\mathbb{P}(W_1 > 0,\ W_2 > 0) = \frac14 + \frac{\arcsin(1/\sqrt{2})}{2\pi} = \frac14 + \frac{\pi/4}{2\pi} = \frac38 = 0{,}375.
$$

Független előjelek esetén $0{,}25$ jönne ki; a többlet $0{,}125$ abból ered, hogy a két érték a $[0, 1]$ szakaszon közös.

## Pályatulajdonságok

Az invarianciákból a következő majdnem biztos tulajdonságok adódnak. Tételként mondjuk ki őket; a bizonyítások bármely Brown-mozgásról szóló tankönyvben megtalálhatók.

- **Iterált logaritmus tétele** (Hincsin): $\limsup_{t \to \infty} W_t / \sqrt{2t\ln\ln t} = 1$. Időinverzióval $\limsup_{t \downarrow 0} W_t / \sqrt{2t\ln\ln(1/t)} = 1$ is teljesül.
- **Rekurrencia**: az iterált logaritmus tételéből és a szimmetriából $\limsup_{t\to\infty} W_t = +\infty$ és $\liminf_{t\to\infty} W_t = -\infty$. A pályák folytonossága miatt $W$ minden $a \in \mathbb{R}$ szintet elér, mégpedig tetszőlegesen nagy időpontokban is. A $t = 0$ körüli változat szerint $W$ minden $[0, \varepsilon]$ intervallumban végtelen sokszor visszatér 0-ba.
- **Sehol sem differenciálhatóság** (Paley, Wiener és Zygmund, 1933): 1 valószínűséggel a $t \mapsto W_t$ függvény egyetlen $t$ pontban sem differenciálható. A skálázás megmutatja, miért: $(W_{t+h} - W_t)/h \sim N(0, 1/h)$, így bármely $K$ korlátra $\mathbb{P}(|(W_{t+h} - W_t)/h| \le K) = \mathbb{P}(|Z| \le K\sqrt{h}) \to 0$, ha $h \downarrow 0$.

## Kvadratikus és teljes változás

Vegyük a $0 = t_0 < t_1 < \cdots < t_n = t$ felosztásokat $\delta_n = \max_i (t_{i+1} - t_i) \to 0$ finomsággal, legyen $\Delta W_i = W_{t_{i+1}} - W_{t_i}$, $\Delta t_i = t_{i+1} - t_i$ és $Q_n = \sum_i (\Delta W_i)^2$. A tétel szerint $Q_n \to t$ az $L^2$ térben; ezt $[W]_t = t$ alakban írjuk. A bizonyítás rövid. Mivel a $\Delta W_i \sim N(0, \Delta t_i)$ változók függetlenek, és $Z \sim N(0, \sigma^2)$ esetén $\operatorname{Var}(Z^2) = 2\sigma^4$,

$$
\mathbb{E}[Q_n] = \sum_i \Delta t_i = t, \qquad \operatorname{Var}(Q_n) = \sum_i 2\,\Delta t_i^2 \le 2t\,\delta_n \longrightarrow 0.
$$

Tehát $\mathbb{E}[(Q_n - t)^2] \to 0$. (Diadikus felosztások mentén a konvergencia majdnem biztos is.) A **teljes változás** ezért végtelen: $Q_n \le \max_i |\Delta W_i| \cdot \sum_i |\Delta W_i|$, és a pálya $[0, t]$-n vett egyenletes folytonossága miatt $\max_i |\Delta W_i| \to 0$, így $\sum_i |\Delta W_i| \to \infty$ egy olyan részsorozat mentén, amelyen $Q_n \to t$ majdnem biztosan. Egy sima függvény teljes változása véges, kvadratikus variációja nulla; a Brown-mozgásnál éppen fordítva van. Ezért nem definiálható a $\int H\,dW$ pályánként, közönséges Stieltjes-integrálként.

## Markov- és erős Markov-tulajdonság

Az időeltolási invariancia a **Markov-tulajdonságot** fejezi ki: minden rögzített $s \ge 0$ esetén a $(W_{s+t} - W_s)_{t \ge 0}$ folyamat $\mathcal{F}_s$-től független Brown-mozgás. Ezzel ekvivalens, hogy korlátos, mérhető $f$ esetén $\mathbb{E}[f(W_{s+t}) \mid \mathcal{F}_s] = g(W_s)$, ahol $g(x) = \mathbb{E}[f(x + W_t)]$: az előrejelzés a múlttól csak a jelenlegi értéken keresztül függ.

Az **erős Markov-tulajdonság** (Hunt, 1956) szerint a rögzített $s$ időpont helyére $\tau$ megállási idő is írható: a $\{\tau < \infty\}$ eseményen a $(W_{\tau+t} - W_\tau)_{t \ge 0}$ folyamat $\mathcal{F}_\tau$-tól független Brown-mozgás. Gondolj rá újraindítási szabályként: ha csak az addig elérhető információ alapján állsz meg, ami ezután jön, az egy friss Brown-mozgás. A jövőbe tekintő véletlen időpontra, például a $[0, 1]$-en vett maximum időpontjára ez nem igaz. A következő lecke az erős Markov-tulajdonságot abban az időpontban használja, amikor a pálya először elér egy szintet.

### Kidolgozott példa: Kovariancia, növekmények és skálázás két időpontban

1. $W_s$ és $W_t$ kovarianciája $s = 0{,}5$, $t = 2$ mellett.
   $$\operatorname{Cov}(W_{0{,}5}, W_2) = \min(0{,}5;\ 2)$$ → **0.5**
2. A $[0{,}5;\ 2]$ szakasz növekményének varianciája az eltelt idő.
   $$\operatorname{Var}(W_2 - W_{0{,}5}) = 2 - 0{,}5$$ → **1.5**
3. Ugyanez a kovarianciából: $\operatorname{Var}(W_2) + \operatorname{Var}(W_{0{,}5}) - 2\operatorname{Cov}$.
   $$2 + 0{,}5 - 2(0{,}5)$$ → **1.5**
4. Skálázás $c = 2$-vel: $\tfrac1c W_{c^2 t}$ varianciája $t = 0{,}5$-nél ugyanannyi, mint $W_{0{,}5}$-é.
   $$\operatorname{Var}\big(\tfrac12 W_{2}\big) = \tfrac14 \cdot 2$$ → **0.5**

## Összefoglalás

- Brown-mozgás: $W_0 = 0$, független növekmények, $W_t - W_s \sim N(0, t-s)$, folytonos pályák; ekvivalensen folytonos, centrált Gauss-folyamat $\operatorname{Cov}(W_s, W_t) = \min(s,t)$ kovarianciával.
- A $-W_t$ szimmetria, a $c^{-1/2}W_{ct}$ skálázás, a $W_{s+t} - W_s$ időeltolás és a $t\,W_{1/t}$ időinverzió ismét Brown-mozgás; az időinverzióból $W_t/t \to 0$ következik.
- A pályák rekurrensek, teljesül rájuk az iterált logaritmus tétele, és sehol sem differenciálhatók.
- A kvadratikus variáció $[W]_t = t$, a teljes változás végtelen.
- Markov-tulajdonság rögzített időpontokban, erős Markov-tulajdonság megállási időkben.

[Becsüld meg a Brown-mozgás kovarianciáját szimulált pályákból a Sztochasztikus modellek stúdióban](https://quantsandbox.dev/hu/stochastic-models/covariance)

## Interaktív laborok

- [Sztochasztikus analízis kurzus: a bolyongástól a Brown-mozgásig](https://quantsandbox.dev/hu/stochastic-models)
- [Brown-mozgás szimulátor drifttel és volatilitással](https://quantsandbox.dev/hu/brownian-motion)

## Gyakorló kérdések

### 1. A $\operatorname{Cov}(W_s, W_t) = \min(s,t)$ képlettel számítsd ki $\operatorname{Cov}(W_2,\, W_3 - W_1)$ értékét.

**Válasz:** 1

$\operatorname{Cov}(W_2, W_3) - \operatorname{Cov}(W_2, W_1) = 2 - 1 = 1$. Másképp: $W_2 = W_1 + (W_2 - W_1)$, és csak a két intervallum közös része, $[1, 2]$ számít, ennek varianciája 1.

### 2. Az alábbi folyamatok közül melyik standard Brown-mozgás?

- a) $X_t = W_{2t}$
- b) $X_t = t\,W_{1/t}$, ha $t > 0$, és $X_0 = 0$
- c) $X_t = \sqrt{t}\,W_1$
- d) $X_t = W_t^2 - t$

**Válasz:** b) $X_t = t\,W_{1/t}$, ha $t > 0$, és $X_0 = 0$

$t\,W_{1/t}$ centrált Gauss-folyamat $\min(s,t)$ kovarianciával, és 0-ban folytonos. $W_{2t}$ varianciája $2t$; $\sqrt{t}\,W_1$ kovarianciája $\sqrt{st} \ne \min(s,t)$, így a növekményei nem függetlenek; $W_t^2 - t$ pedig nem Gauss-eloszlású.

### 3. Osszuk a $[0, 1]$ intervallumot $n = 100$ egyenlő lépésre. Mennyi $\operatorname{Var}\big(\sum_i (\Delta W_i)^2\big)$?

**Válasz:** 0.02

Minden tag varianciája $2\,\Delta t^2 = 2 \times 0{,}01^2 = 0{,}0002$, és 100 független tag van: $100 \times 0{,}0002 = 0{,}02 = 2/n$. A várható érték 1, így az összeg az $[W]_1 = 1$ érték körül koncentrálódik.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/brownian-properties

Előző lecke: [Feltételes várható érték és martingálok](https://quantsandbox.dev/hu/guide/stochastic/martingales)

Következő lecke: [A tükrözési elv és az első elérési idők](https://quantsandbox.dev/hu/guide/stochastic/reflection-principle)
