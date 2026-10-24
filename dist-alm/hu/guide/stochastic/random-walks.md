# Véletlen bolyongás és Brown-mozgás

Pénzfeldobásos bolyongás, a variancia lineáris növekedése és a határeset: a Brown-mozgás.

A „Hozamok és volatilitás” című lecke megmutatta, hogy független hozamok esetén a teljes loghozam szórása $\sigma\sqrt{T}$-ként nő. Ez a lecke a szabály mögötti véletlen folyamatot a lehető legegyszerűbb építőelemből, egy szabályos pénzérméből rakja össze, majd egy határátmenettel eljut a Brown-mozgáshoz. A későbbi folytonos idejű modellekben minden véletlenség ebből származik.

## Pénzfeldobásos bolyongás

Dobjunk fel ismételten egy szabályos érmét. Fej esetén lépjünk egy egységet felfelé, írás esetén egyet lefelé. A $k$-adik lépés legyen $X_k$, tehát $X_k = +1$ vagy $X_k = -1$, mindkettő $\tfrac12$ valószínűséggel, és a dobások egymástól függetlenek. A nulláról induló pozíció $n$ dobás után

$$
W_n = X_1 + X_2 + \cdots + X_n.
$$

Ez a **szimmetrikus véletlen bolyongás**. Képzelj el valakit egy hosszú folyosón, aki másodpercenként az érme szerint egyet előre vagy egyet hátra lép. Senki sem tudja megmondani, hol lesz 100 lépés után, de a valószínű helyzetek szóródása pontosan kiszámolható.

## A bolyongás várható értéke és varianciája

Minden lépés várható értéke nulla, varianciája egy:

$$
\mathbb{E}[X_k] = \tfrac12(+1) + \tfrac12(-1) = 0, \qquad \operatorname{Var}(X_k) = \mathbb{E}[X_k^2] = 1.
$$

A várható értékek mindig összeadódnak, a varianciák pedig akkor, ha a tagok függetlenek, és itt azok. Így

$$
\mathbb{E}[W_n] = 0, \qquad \operatorname{Var}(W_n) = n, \qquad \operatorname{sd}(W_n) = \sqrt{n}.
$$

A variancia a lépésszámmal **lineárisan** nő, a szórás ennek gyökével. 100 dobás után a kiindulóponttól mért jellemző távolság $\sqrt{100} = 10$ egység, nem 100. 10000 dobás után 100. A lépések részben kioltják egymást, ezért nő a szóródás sokkal lassabban, mint a lépések száma.

## A lépések skálázása

Folytonosan mozgó árfolyam leírásához egy rögzített időintervallumon belül sok kis lépésre van szükség, nem másodpercenkénti egységlépésekre. Rögzítsük a $[0, 1]$ intervallumot, osszuk fel $n$ darab $\Delta t = 1/n$ hosszú lépésre, és legyen minden lépés mérete $\pm a$, ahol $a$-t még meg kell választani. $k$ lépés után az idő $t = k\,\Delta t$, a pozíció varianciája pedig $k a^2 = (t/\Delta t)\,a^2$.

Növeljük most $n$-et, vagyis csökkentsük $\Delta t$-t. Három eset van:

- Ha $a = 1$, a $t/\Delta t$ variancia minden határon túl nő. A bolyongás elszáll.
- Ha $a = \Delta t$, a $t\,\Delta t$ variancia nullához tart. A bolyongás vízszintes egyenessé laposodik.
- Ha $a = \sqrt{\Delta t}$, a variancia minden $n$-re pontosan $t$. Csak ez a választás ad nem triviális határértéket.

A lépésméretnek tehát az időlépés **négyzetgyökével** kell arányosnak lennie:

$$
W_{t + \Delta t} = W_t \pm \sqrt{\Delta t}, \qquad \operatorname{Var}(W_t) = \frac{t}{\Delta t}\cdot \Delta t = t.
$$

Példa: $n = 100$ lépésnél a $[0,1]$ intervallumon minden lépés $\pm\sqrt{0{,}01} = \pm 0{,}1$. A $t = 0{,}25$ időpontig 25 lépés történt, így a variancia $25 \times 0{,}01 = 0{,}25$, a szórás $0{,}5$. A $t = 1$ időpontban a szórás 1.

Az ábra a skálázott bolyongás hat mintapályáját rajzolja ki a $[0,1]$ intervallumon, a $\pm\sqrt{t}$ és $\pm 2\sqrt{t}$ görbékkel együtt. Válts az $n = 10$, $100$ és $1000$ lépés között, és nyomd meg néhányszor az „Új pályák” gombot. A pályák finomabbak lesznek, a burkológörbe viszont ugyanaz marad, és a 2000 szimulált pálya végpontjainak varianciája $n$-től függetlenül 1 közelében van.

*[Interaktív ábra: random walk](https://quantsandbox.dev/hu/guide/stochastic/random-walks)*

## Brown-mozgás

Ha $n \to \infty$, minden $W_t$ egyre több kicsi, független lépés összege, ezért a centrális határeloszlás-tétel szerint eloszlása normálissá válik. A határfolyamat a **Brown-mozgás** (más néven Wiener-folyamat), jele $W_t$. Négy tulajdonság határozza meg:

- $W_0 = 0$.
- $s < t$ esetén a $W_t - W_s$ növekmény normális eloszlású, várható értéke 0, varianciája $t - s$.
- A nem átfedő intervallumokon vett növekmények függetlenek.
- A $t \mapsto W_t$ pálya folytonos.

A második tulajdonságba $s = 0$-t írva

$$
W_t \sim N(0,\ t).
$$

Példa: $W_1$ standard normális, így kb. 68% valószínűséggel esik $-1$ és $1$ közé. A $W_1 - W_{0{,}5}$ növekmény varianciája $0{,}5$, függetlenül attól, mit csinált a pálya $t = 0{,}5$ előtt.

> Brown-mozgás: $W_0 = 0$, független növekmények, $W_t - W_s \sim N(0, t-s)$, folytonos pályák. Speciálisan $\operatorname{Var}(W_t) = t$.

## Folytonos, de recés pályák

A Brown-pályákban nincs ugrás, mégis rendkívül egyenetlenek. Egy rövid $\Delta t$ intervallumon a jellemző elmozdulás $\sqrt{\Delta t}$, így a jellemző meredekség

$$
\frac{\sqrt{\Delta t}}{\Delta t} = \frac{1}{\sqrt{\Delta t}} \longrightarrow \infty \quad \text{ha } \Delta t \to 0.
$$

Ha belenagyítunk, a pálya nem simul ki, ahogy egy közönséges sima görbe tenné, hanem minden léptékben újabb hullámzás jelenik meg. A pályának egyetlen pontban sincs jól definiált meredeksége. Ezért nem alkalmazható közvetlenül a szokásos analízis a Brown-mozgásra, és ezért lesz szükség a későbbi leckékben egy korrekciós tagra.

## Kapcsolat a négyzetgyökös időszabállyal

Kössük össze ezt a „Hozamok és volatilitás” leckével. Modellezzük a $[0, T]$ alatti loghozamot egy lineáris drift és egy skálázott Brown-mozgás összegeként:

$$
\ln\frac{S_T}{S_0} = \mu T + \sigma W_T.
$$

Mivel $W_T \sim N(0, T)$, a loghozam normális eloszlású $\mu T$ várható értékkel és $\sigma\sqrt{T}$ szórással, pontosan úgy, mint a „Hozamok és volatilitás” lecke első modelljében. A szabályban szereplő $\sqrt{T}$ nem más, mint a bolyongás $\sqrt{t}$ burkológörbéje az ábrán.

## Végpontok és a haranggörbe

Egyetlen bolyongás keveset árul el, sok bolyongás viszont kirajzolja az eloszlást. Az ábrán minden bolyongó $n$ darab $\pm 1$-es lépést tesz, majd a végpontjának megfelelő oszlopba esik. Nyomd meg a Lejátszás gombot, vagy adj hozzá bolyongókat kézzel, és figyeld, ahogy a hisztogram kitölti az $n$ varianciájú normális görbét. A mintavariancia bármely $n$ mellett $n$ közelébe áll be, és $n$ duplázásakor a szóródás $\sqrt{2}$-szeresére nő, nem kétszeresére.

*[Interaktív ábra: galton walk](https://quantsandbox.dev/hu/guide/stochastic/random-walks)*

### Kidolgozott példa: Egy négylépéses bolyongás eloszlása

1. A $W_4 = 2$-ben végződő pályákhoz három felfelé és egy lefelé lépés kell; számold meg a sorrendeket.
   $$\binom{4}{3}$$ → **4**
2. Minden pálya valószínűsége $(1/2)^4$.
   $$\Pr(W_4 = 2) = 4 \cdot (1/2)^4$$ → **0.25**
3. A várható érték nulla, mert minden lépés várható értéke nulla.
   $$\mathbb{E}[W_4] = 0$$ → **0**
4. A variancia a lépések száma.
   $$\operatorname{Var}(W_4) = 4 \cdot 1$$ → **4**

## Összefoglalás

- $n$ független $\pm 1$ lépésből álló pénzfeldobásos bolyongás várható értéke 0, varianciája $n$, így a szóródása $\sqrt{n}$-ként nő.
- Értelmes folytonos idejű határértékhez a $\Delta t$ hosszú lépések mérete $\pm\sqrt{\Delta t}$ kell legyen; ekkor $\operatorname{Var}(W_t) = t$.
- A határfolyamat a Brown-mozgás: $W_0 = 0$, független, normális növekmények az eltelt idővel egyenlő varianciával, folytonos pályák.
- A Brown-pályák folytonosak, de sehol sincs meredekségük.
- A $\mu T + \sigma W_T$ loghozam-modell visszaadja a négyzetgyökös időszabályt.

[Szimulálj és vizsgálj Brown-pályákat a Brown-mozgás laborban](https://quantsandbox.dev/hu/brownian-motion)

## Interaktív laborok

- [Brown-mozgás szimulátor drifttel és volatilitással](https://quantsandbox.dev/hu/brownian-motion)
- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)

## Gyakorló kérdések

### 1. Egy szimmetrikus bolyongás 100 független, $\pm 1$-es lépést tesz. Mennyi a $W_{100}$ pozíció varianciája?

**Válasz:** 100

Minden lépés varianciája 1, és független tagok varianciái összeadódnak, így $\operatorname{Var}(W_{100}) = 100$; a szórás 10.

### 2. A $[0, 1]$ intervallumot $n$ darab $1/n$ hosszú lépésre osztjuk. Melyik lépésméret mellett tart a bolyongás a Brown-mozgáshoz, ha $n \to \infty$?

- a) $\pm 1$
- b) $\pm 1/n$
- c) $\pm\sqrt{1/n}$
- d) $\pm n$

**Válasz:** c) $\pm\sqrt{1/n}$

$\pm\sqrt{\Delta t}$ lépésekkel a $t$ időpontbeli variancia minden $n$-re $(t/\Delta t)\,\Delta t = t$. $\pm 1$-es lépésekkel a variancia elszáll, $\pm 1/n$-esekkel eltűnik.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/random-walks

Következő lecke: [A nagy számok törvénye és a centrális határeloszlás-tétel](https://quantsandbox.dev/hu/guide/stochastic/law-of-large-numbers-clt)
