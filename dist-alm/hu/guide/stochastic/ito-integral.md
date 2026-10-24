# Az Itô-integrál

Egyszerű integrandusok, Itô-izometria, martingál-tulajdonság és a ∫W dW = (W² − t)/2 levezetése.

Ez a lecke a $\int_0^t H_s\,dW_s$ sztochasztikus integrált definiálja, amely értelmet ad az árfolyamokra használt $dX = a\,dt + b\,dW$ kifejezésnek. Épít a „Filtrációk, adaptált folyamatok és megállási idők” (adaptált integrandusok), a „Feltételes várható érték és martingálok” (martingáltulajdonság) és „A Brown-mozgás tulajdonságai” (végtelen teljes variáció és a $[W]_t = t$ kvadratikus variáció) című leckékre. A következő lecke, „Az Itô-lemma”, ezeknek az integráloknak a láncszabálya.

## A Riemann–Stieltjes-integrál kudarca

Egy determinisztikus $g$ függvényre a $\int_0^t f\,dg$ Riemann–Stieltjes-integrál a $\sum_i f(s_i)\,(g(t_{i+1}) - g(t_i))$ összegek határértéke olyan $0 = t_0 < t_1 < \dots < t_n = t$ felosztások mentén, amelyek finomsága, $\max_i (t_{i+1} - t_i)$, nullához tart, tetszőleges $s_i \in [t_i, t_{i+1}]$ kiértékelési pontokkal. Egy klasszikus tétel szerint ez a határérték pontosan akkor létezik minden folytonos $f$-re, ha $g$ korlátos változású. A Brown-pályák teljes variációja majdnem biztosan végtelen minden intervallumon, így a pályánkénti konstrukció nem használható.

A kudarc a legegyszerűbb esetben, $f = g = W$ mellett is látszik. Jelölje $\Delta W_i = W_{t_{i+1}} - W_{t_i}$, és vessük össze a jobb és a bal végponti összeget:

$$
\sum_{i} W_{t_{i+1}}\,\Delta W_i - \sum_{i} W_{t_i}\,\Delta W_i = \sum_{i} (\Delta W_i)^2 \longrightarrow t.
$$

A különbség a $t$ kvadratikus variációhoz tart, nem nullához, vagyis az eredmény attól függ, hol értékeljük ki az integrandust az egyes intervallumokon. A definíciónak rögzítenie kell a kiértékelési pontot. Itô választása a bal végpont.

## Egyszerű integrandusok

Rögzítsünk egy $(\Omega, \mathcal{F}, \mathbb{P})$ valószínűségi mezőt egy $(\mathcal{F}_t)_{t \ge 0}$ filtrációval, és egy erre vonatkozó $W$ Brown-mozgást: $W$ adaptált, és minden $W_u - W_s$ ($u > s$) növekmény független $\mathcal{F}_s$-től. Egy $H$ folyamat **egyszerű**, ha vannak $0 = t_0 < t_1 < \dots < t_n = T$ időpontok és $\xi_0, \dots, \xi_{n-1}$ valószínűségi változók, ahol $\xi_i$ korlátos és $\mathcal{F}_{t_i}$-mérhető, úgy, hogy

$$
H_s = \sum_{i=0}^{n-1} \xi_i\,\mathbf{1}_{(t_i,\, t_{i+1}]}(s).
$$

A $(t_i, t_{i+1}]$ intervallumon felvett érték a bal végpontban rögzül, csak az ott elérhető információ alapján. Ilyen $H$-ra az **Itô-integrált** közvetlenül véges összegként definiáljuk, $t_k \le t \le t_{k+1}$ esetén:

$$
\int_0^t H_s\,dW_s = \sum_{i=0}^{k-1} \xi_i\,\big(W_{t_{i+1}} - W_{t_i}\big) + \xi_k\,\big(W_t - W_{t_k}\big).
$$

Kereskedési nyelven $\xi_i$ a $(t_i, t_{i+1}]$ alatt tartott részvények száma, amelyet $t_i$-ben választunk, az integrál pedig a felhalmozott nyereség.

## Az Itô-izometria

**Tétel.** Egyszerű $H$-ra

$$
\mathbb{E}\!\left[\Big(\int_0^T H_s\,dW_s\Big)^{2}\right] = \mathbb{E}\!\left[\int_0^T H_s^2\,ds\right].
$$

**Bizonyítás.** Legyen $I = \sum_i \xi_i\,\Delta W_i$, és bontsuk a négyzetet átlós és vegyes tagokra. Az átlóban $\xi_i^2$ $\mathcal{F}_{t_i}$-mérhető, $\Delta W_i$ pedig független $\mathcal{F}_{t_i}$-től, varianciája $t_{i+1} - t_i$, így a toronyszabály szerint

$$
\mathbb{E}\big[\xi_i^2 (\Delta W_i)^2\big] = \mathbb{E}\Big[\xi_i^2\,\mathbb{E}\big[(\Delta W_i)^2 \mid \mathcal{F}_{t_i}\big]\Big] = \mathbb{E}[\xi_i^2]\,(t_{i+1} - t_i).
$$

Egy $i < j$ vegyes tagban a $\xi_i \xi_j \Delta W_i$ szorzat $\mathcal{F}_{t_j}$-mérhető, míg $\mathbb{E}[\Delta W_j \mid \mathcal{F}_{t_j}] = 0$; ezért $\mathbb{E}[\xi_i \xi_j \Delta W_i \Delta W_j] = 0$. Az átlós tagokat összeadva $\mathbb{E}[I^2] = \sum_i \mathbb{E}[\xi_i^2](t_{i+1} - t_i) = \mathbb{E}\big[\int_0^T H_s^2\,ds\big]$. $\square$

Az adaptáltságot kétszer használtuk: amikor $\xi_i$-t kiemeltük a feltételes várható értékből, és amikor a vegyes tagok eltűntek. Ha az integrandus belelát a saját intervallumába, mindkét lépés elromlik.

> Itô-izometria: $\mathbb{E}\big[(\int_0^T H\,dW)^2\big] = \mathbb{E}\big[\int_0^T H^2\,ds\big]$. Egy véletlen integrálra vonatkozó kérdést közönséges $ds$-integrállá alakít.

## Kiterjesztés általános integrandusokra

Jelölje $\mathcal{L}^2_T$ azon progresszíven mérhető (adaptált és $(s, \omega)$-ban együttesen mérhető) folyamatok halmazát, amelyekre $\mathbb{E}\big[\int_0^T H_s^2\,ds\big] < \infty$. Minden $H \in \mathcal{L}^2_T$ előáll $H^{(n)}$ egyszerű folyamatok határértékeként az $\|H\|^2 = \mathbb{E}\big[\int_0^T H_s^2\,ds\big]$ normában. Az izometria miatt az $I(H^{(n)})$ integrálok Cauchy-sorozatot alkotnak $L^2(\Omega)$-ban, tehát konvergálnak, és a határérték nem függ a közelítő sorozattól. Ez a határérték $H$ Itô-integrálja, így az izometria az egész $\mathcal{L}^2_T$-n érvényes. Azok az integrandusok, amelyekre csak majdnem biztosan $\int_0^T H_s^2\,ds < \infty$, megállítással (lokalizációval) kezelhetők; ekkor az eredmény martingál helyett lokális martingál.

## Tulajdonságok

$H, K \in \mathcal{L}^2_T$ és $a, b$ konstansok mellett az $I_t = \int_0^t H_s\,dW_s$ folyamat tulajdonságai az alábbiak. Mindegyiket egyszerű integrandusokon ellenőrizzük, és a határátmenet megőrzi.

- Linearitás: $\int (aH + bK)\,dW = a\int H\,dW + b\int K\,dW$.
- Nulla várható érték: $\mathbb{E}[I_t] = 0$, mert $\mathbb{E}[\xi_i \Delta W_i] = \mathbb{E}\big[\xi_i\,\mathbb{E}[\Delta W_i \mid \mathcal{F}_{t_i}]\big] = 0$.
- Martingál: $s \le t$ esetén $\mathbb{E}[I_t \mid \mathcal{F}_s] = I_s$, és $I$-nek van folytonos pályájú változata.
- Izometria és kovariancia: $\mathbb{E}[I_t^2] = \mathbb{E}\big[\int_0^t H_s^2\,ds\big]$ és $\mathbb{E}\big[\int_0^t H\,dW \int_0^t K\,dW\big] = \mathbb{E}\big[\int_0^t H_s K_s\,ds\big]$.
- Kvadratikus variáció: $[I]_t = \int_0^t H_s^2\,ds$, a $[W]_t = t$ integrálos megfelelője.

Determinisztikus $h$ integrandusra az integrál normális eloszlású: $\int_0^t h(s)\,dW_s \sim N\big(0, \int_0^t h(s)^2\,ds\big)$. Például $\int_0^1 s\,dW_s \sim N(0, 1/3)$.

## A W önmaga szerinti integrálja

Legyen $H = W$ a $[0, t]$ intervallumon, $t_i = it/n$ rácsponttal. A bal végponti összeg a $b(a - b) = \tfrac12(a^2 - b^2) - \tfrac12(a - b)^2$ azonossággal írható át, $a = W_{t_{i+1}}$, $b = W_{t_i}$ választással:

$$
\sum_{i=0}^{n-1} W_{t_i}\,\Delta W_i = \frac{1}{2}\sum_{i=0}^{n-1}\big(W_{t_{i+1}}^2 - W_{t_i}^2\big) - \frac{1}{2}\sum_{i=0}^{n-1}(\Delta W_i)^2 = \frac{1}{2}W_t^2 - \frac{1}{2}\sum_{i=0}^{n-1}(\Delta W_i)^2.
$$

Az első összeg teleszkopikus, és ez minden $n$-re pontos azonosság. Egyedül a második összeg marad véletlen közelítés. Minden $(\Delta W_i)^2$ várható értéke $t/n$, varianciája $2(t/n)^2$, és ezek függetlenek, ezért

$$
\mathbb{E}\Big[\sum_i (\Delta W_i)^2\Big] = t, \qquad \operatorname{Var}\Big(\sum_i (\Delta W_i)^2\Big) = \frac{2t^2}{n} \longrightarrow 0.
$$

Az összeg $L^2$-ben $t$-hez tart, következésképpen

$$
\int_0^t W_s\,dW_s = \frac{W_t^2 - t}{2}.
$$

A $-t/2$ pontosan a kvadratikus variáció fele. A szokásos analízis $W_t^2/2$-t adna; a korrekció azért jelenik meg, mert a Brown-mozgás négyzetes növekményei a határátmenetben nem tűnnek el. Az eredmény összhangban van a fenti tulajdonságokkal: várható értéke $(t - t)/2 = 0$, varianciája $\operatorname{Var}(W_t^2)/4 = 2t^2/4 = t^2/2$, ami egyezik az izometriából adódó $\int_0^t \mathbb{E}[W_s^2]\,ds = \int_0^t s\,ds = t^2/2$ értékkel.

Számokkal: ha $W_1 = 1{,}3$, akkor $\int_0^1 W\,dW = (1{,}69 - 1)/2 = 0{,}345$, míg $W_1^2/2 = 0{,}845$. Egy $n$ lépéses rácson a bal végponti összeg eltérése $(W_1^2 - 1)/2$-től $-\tfrac12\big(\sum_i(\Delta W_i)^2 - 1\big)$, amelynek szórása $\sqrt{1/(2n)}$: $n = 10$ esetén $0{,}224$, $n = 100$ esetén $0{,}0707$, $n = 10\,000$ esetén $0{,}00707$.

## Bal végponti és felezőponti kiértékelés

Értékeljünk inkább az $m_i = (t_i + t_{i+1})/2$ felezőpontban. Bontsuk fel: $\Delta W_i = A_i + B_i$, ahol $A_i = W_{m_i} - W_{t_i}$ és $B_i = W_{t_{i+1}} - W_{m_i}$ független $N(0, t/(2n))$ változók. Mivel $W_{m_i} = W_{t_i} + A_i$,

$$
\sum_i W_{m_i}\,\Delta W_i = \sum_i W_{t_i}\,\Delta W_i + \sum_i A_i^2 + \sum_i A_i B_i \longrightarrow \frac{W_t^2 - t}{2} + \frac{t}{2} + 0 = \frac{W_t^2}{2}.
$$

Itt $\sum_i A_i^2 \to t/2$ az előbbi varianciaérvvel, $\sum_i A_i B_i$ várható értéke pedig nulla, varianciája $n\,(t/2n)^2 \to 0$. A felezőponti határérték a **Stratonovich-integrál**, jelölése $\int_0^t W_s \circ dW_s = W_t^2/2$. Általában $\int H \circ dW = \int H\,dW + \tfrac12 [H, W]_t$, ahol $[H, W]$ a kvadratikus kovariáció; $H = W$ esetén ez $t/2$.

Az ábra egyetlen Brown-pályát rajzol a $[0, 1]$ intervallumon, és a választott $n$ lépésszámra (10, 100, 1000 vagy 10 000) $t$ függvényében mutatja a $\sum W_{t_i} \Delta W_i$ futó bal végponti összeget, a $\sum W_{(t_i + t_{i+1})/2} \Delta W_i$ futó felezőponti összeget, valamint a $(W_t^2 - t)/2$ és $W_t^2/2$ görbéket. Növeld $n$-et, és figyeld meg, hogy a bal végponti összeg a $(W_t^2 - t)/2$, a felezőponti a $W_t^2/2$ görbére simul. A $t = 1$-beli kijelzők a bal összeget $(W_1^2 - 1)/2$-vel, a felezőponti összeget $W_1^2/2$-vel vetik össze, és mutatják a két összeg különbségét, amely $n$ növelésével $0{,}5 = t/2$-höz tart. Az „Új pálya” gombbal másik pályán ismételhető; a $t/2$ eltérés megmarad.

*[Interaktív ábra: ito sums](https://quantsandbox.dev/hu/guide/stochastic/ito-integral)*

A két integrálnak egymást kiegészítő erősségei vannak. A Stratonovich-integrál a szokásos láncszabályt követi, ezért gyakori a fizikában, ahol a fehér zaj egy sima, de gyors fizikai jelet modellez. Az Itô-integrál martingál: $\mathbb{E}\big[\int_0^t W\,dW\big] = 0$, míg $\mathbb{E}\big[\int_0^t W \circ dW\big] = t/2$. A pénzügyekben modellezési ok miatt Itô-integrált használunk. A kereskedő az időszak elején, az $\mathcal{F}_{t_i}$ információ alapján választja meg a $\xi_i$ pozíciót, és csak utána mozdul az ár. A $\xi_i\,(S_{t_{i+1}} - S_{t_i})$ nyereség bal végponti összeg. A felezőponti kiértékelés megengedné, hogy a pozíció függjön annak az ármozgásnak a feléből, amelyért fizetnek érte, ez pedig a jövőbeli információval való kereskedés egy formája. Olyan mérték alatt, amelyben a diszkontált árak martingálok, az Itô-integrál minden ilyen stratégia nyereségét is martingálnak tartja; ez annak folytonos idejű megfogalmazása, hogy egyetlen stratégia sem változtat egy igazságos játékot biztos nyereséggé.

### Kidolgozott példa: W önmagára vett integráljának momentumai

1. Adaptált integrandus Itô-integráljának várható értéke nulla.
   $$\mathbb{E}\Big[\int_0^2 W_t\,dW_t\Big] = 0$$ → **0**
2. Az Itô-izometria a varianciát közönséges integrállá alakítja, $\int_0^T t\,dt = T^2/2$, itt $T = 2$-vel.
   $$\operatorname{Var}\Big(\int_0^2 W_t\,dW_t\Big) = \int_0^2 \mathbb{E}[W_t^2]\,dt = \frac{2^2}{2}$$ → **2**
3. Egy $W_2 = 1{,}5$-ben végződő pályán a zárt alak megadja az integrál értékét.
   $$\int_0^2 W_t\,dW_t = \frac{W_2^2 - 2}{2} = \frac{2{,}25 - 2}{2}$$ → **0.125**

## Összefoglalás

- A Brown-pályák végtelen variációjúak, ezért $\int H\,dW$ pályánként nem definiálható; az összegek értéke függ a kiértékelési ponttól.
- Egyszerű adaptált $H$-ra az Itô-integrál $\sum_i \xi_i\,\Delta W_i$, ahol $\xi_i$ $t_i$-ben ismert; az $\mathbb{E}[(\int H\,dW)^2] = \mathbb{E}[\int H^2\,ds]$ Itô-izometria $L^2$-határértékkel kiterjeszti az egész $\mathcal{L}^2_T$-re.
- Az Itô-integrál lineáris, várható értéke nulla, martingál, kvadratikus variációja $\int H^2\,ds$.
- $\int_0^t W\,dW = (W_t^2 - t)/2$: a $-t/2$ a $\sum (\Delta W_i)^2 \to t$ tényből ered. A felezőponti kiértékelés a $W_t^2/2$ Stratonovich-értéket adja.
- A pénzügyekben azért Itô-integrált használunk, mert a pozíciót az ármozgás előtt választjuk meg.

> A következő lecke, „Az Itô-lemma”, a $W^2$-re végzett számolásból általános szabályt csinál: $d(W_t^2) = 2W_t\,dW_t + dt$ éppen az $\int_0^t W\,dW = (W_t^2 - t)/2$ differenciális alakja.

[Nézd meg az Itô-korrekciót szimulált logárakon az Itô-folyamat laborban](https://quantsandbox.dev/hu/ito-process)

## Interaktív laborok

- [Itô-lemma vizualizáció: a −½σ² driftkorrekció](https://quantsandbox.dev/hu/ito-process)
- [Brown-mozgás szimulátor drifttel és volatilitással](https://quantsandbox.dev/hu/brownian-motion)

## Gyakorló kérdések

### 1. Számítsd ki az Itô-izometriával $\operatorname{Var}\big(\int_0^2 W_s\,dW_s\big)$ értékét! (Az integrál várható értéke nulla.)

**Válasz:** 2

A variancia $\mathbb{E}\big[\int_0^2 W_s^2\,ds\big] = \int_0^2 s\,ds = 2$. Ellenőrzésként: $\int_0^2 W\,dW = (W_2^2 - 2)/2$ és $\operatorname{Var}(W_2^2)/4 = 2 \cdot 2^2/4 = 2$.

### 2. Egy Brown-pálya végpontja $W_1 = 1{,}3$. Mennyi az $\int_0^1 W_s\,dW_s$ Itô-integrál értéke ezen a pályán?

**Válasz:** 0.345

$\int_0^1 W\,dW = (W_1^2 - 1)/2 = (1{,}69 - 1)/2 = 0{,}345$. A $-1$ a $[W]_1 = 1$ kvadratikus variáció; a naiv $W_1^2/2 = 0{,}845$ a Stratonovich-integrál értéke.

### 3. Miért az Itô-féle (bal végponti) integrállal modellezzük a kereskedési nyereséget a Stratonovich-féle (felezőponti) helyett?

- a) Mert a Stratonovich-integrál Brown-mozgásra nem létezik
- b) Mert a $(t_i, t_{i+1}]$ alatti pozíciót $t_i$-ben, az $\mathcal{F}_{t_i}$ információ alapján választjuk, így az integrandus nem láthatja előre a mozgást
- c) Mert az Itô-integrál a szokásos láncszabályt követi
- d) Mert minden integrandusra ugyanazt az értéket adják

**Válasz:** b) Mert a $(t_i, t_{i+1}]$ alatti pozíciót $t_i$-ben, az $\mathcal{F}_{t_i}$ információ alapján választjuk, így az integrandus nem láthatja előre a mozgást

A kereskedési pozíciót az általa megkeresett árváltozás előtt rögzítjük, ez bal végponti kiértékelés. A Stratonovich-integrál létezik, de az intervallum belsejében értékel ki, és nem az Itô-, hanem a Stratonovich-integrál követi a szokásos láncszabályt. $H = W$ esetén a kettő $t/2$-vel tér el.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/ito-integral

Előző lecke: [A Brown-híd](https://quantsandbox.dev/hu/guide/stochastic/brownian-bridge)

Következő lecke: [Az Itô-lemma](https://quantsandbox.dev/hu/guide/stochastic/ito-lemma)
