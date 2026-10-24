# A Brown-híd

Brown-mozgás rögzített végponttal: konstrukció, kovariancia, függetlenség és alkalmazások.

Ez a lecke a mindkét végén rögzített Brown-mozgást vizsgálja: a **Brown-hidat**. „A Brown-mozgás tulajdonságai” (a Gauss-jellemzés és a $\min(s, t)$ kovariancia) és a „Feltételes várható érték és martingálok” (együttesen Gauss-eloszlású változók kondicionálása) leckékre épít. A híd a megfelelő eszköz mindig, amikor a pálya értéke egy későbbi időpontban ismert: kitölti a szimulációt két megmintázott pont között, és megméri annak esélyét, hogy a pálya két rácspont között átlépett egy szintet — ez „A tükrözési elv és az első elérési idők” leckében nyitva hagyott „rejtett átlépés”.

## Definíció és konstrukció

Legyen $W$ standard Brown-mozgás. Egy $b$ célvégponthoz definiáljuk a $[0, 1]$-en értelmezett folyamatot

$$
B_t = W_t - t\,W_1 + t\,b, \qquad 0 \le t \le 1.
$$

A végpontokon $B_0 = 0$ és $B_1 = W_1 - W_1 + b = b$, tehát a pálya a $t = 1$ időpontban $b$-hez van kötve. A $b = 0$ speciális eset a **standard Brown-híd** $B^0_t = W_t - t\,W_1$, az általános híd pedig $B_t = B^0_t + t\,b$: egy standard híd, amelyhez hozzáadjuk a $t \mapsto t\,b$ egyenest. Minden $B_t$ a $(W_s)$ Gauss-vektor lineáris kombinációja, így $B$ ismét Gauss-folyamat, amelyet a várható értéke és a kovarianciája meghatároz.

> A $[0, 1]$-en 0-tól $b$-ig futó Brown-híd $B_t = W_t - t\,W_1 + t\,b$. Ez az a folytonos Gauss-pálya, amelyre $B_0 = 0$, $B_1 = b$, a $t\,b$ egyenes felé húzódik, és középen a legszabadabban kalandozik.

## Várható érték és kovariancia

Várható értéket véve $\mathbb{E}[B_t] = \mathbb{E}[W_t] - t\,\mathbb{E}[W_1] + t\,b = t\,b$: a várható érték a végpontokat összekötő egyenes. A kovarianciához elég a standard hidat, $B^0_t = W_t - t\,W_1$, vizsgálni, mert a determinisztikus $t\,b$ tag nem változtatja meg a második momentumokat. $\operatorname{Cov}(W_s, W_t) = \min(s, t)$ felhasználásával $s \le t$ esetén

$$
\operatorname{Cov}(B^0_s, B^0_t) = s - s\,t - t\,s + s\,t = s - s\,t = s\,(1 - t), \qquad s \le t.
$$

$s = t$ esetén a szórásnégyzet $\operatorname{Var}(B_t) = t\,(1 - t)$, egy parabola, amely mindkét végen nulla és a felezőpontban a legnagyobb, ahol $\operatorname{Var}(B_{1/2}) = 1/4$. A hídnak a végpontokban nincs szabadsága, középen a legtöbb; ez a jellegzetes alakja az ábra szórássávjainak.

## A híd mint kondicionált Brown-mozgás

A konstrukció nem véletlen: a híd pontosan a végpontjára **kondicionált** Brown-mozgás. A $(W_t, W_1)$ pár együttesen Gauss-eloszlású, $\operatorname{Cov}(W_t, W_1) = t$ és $\operatorname{Var}(W_1) = 1$. A Gauss-kondicionálási képlet szerint

$$
\mathbb{E}[W_t \mid W_1 = b] = \frac{\operatorname{Cov}(W_t, W_1)}{\operatorname{Var}(W_1)}\,b = t\,b, \qquad \operatorname{Var}(W_t \mid W_1) = t - \frac{t^2}{1} = t\,(1 - t).
$$

Ezek pontosan $B_t$ várható értéke és szórásnégyzete. A teljes kovariancia rövid számolása megerősíti, hogy az egész kondicionált folyamat, $(W_t \mid W_1 = b)$, eloszlása megegyezik $B$-ével. Egy második tény teszi teljessé a felbontást: $B^0_t = W_t - t\,W_1$ **független** $W_1$-től, mert együttesen Gauss-eloszlásúak és

$$
\operatorname{Cov}(W_t - t\,W_1,\ W_1) = t - t \cdot 1 = 0.
$$

Így a Brown-mozgás két független részre bomlik — egy hídra, amely nem törődik a végponttal, és magára a végpontra:

$$
W_t = B^0_t + t\,W_1, \qquad B^0 \perp W_1.
$$

Egy finom rácson vett Brown-pálya szimulálásához tehát először kisorsolható a végpont, $W_1 \sim N(0, 1)$, majd a belső rész kitölthető egy független standard híddal. Ezt minden megmintázott időpontpár között megismételve kapjuk azt a rekurzív finomítást, amellyel egyre finomabb felbontású Brown-pályák állíthatók elő.

*[Interaktív ábra: brownian bridge](https://quantsandbox.dev/hu/guide/stochastic/brownian-bridge)*

## A rejtett átlépés valószínűsége

A tükrözési leckében láttuk, hogy a csak rácspontokban vett szimulált maximum nem veszi észre a pontok közötti átlépéseket. A híd pontosan megmondja, milyen gyakran fordul ez elő. Tegyük fel, hogy egy pályát egy $\Delta$ hosszúságú intervallum végein figyelünk meg, $w_0$ és $w_1$ értékekkel. Ezekre kondicionálva a közbenső pálya Brown-híd, és annak valószínűsége, hogy valahol belül felemelkedik egy $a \ge \max(w_0, w_1)$ szintre, a hídra alkalmazott tükrözési érveléssel

$$
\mathbb{P}\Big(\max_{0 \le t \le \Delta} X_t \ge a \ \Big|\ X_0 = w_0,\ X_\Delta = w_1\Big) = \exp\!\Big(-\frac{2\,(a - w_0)(a - w_1)}{\Delta}\Big).
$$

A $w_0 = w_1 = 0$ pontokban $[0, 1]$-en rögzített standard hídra ez $\mathbb{P}(\max B^0 \ge a) = e^{-2a^2}$, ami sokkal gyorsabban cseng le, mint a feltétel nélküli $2(1 - \Phi(a))$ farok, mert mindkét vég lefelé tartja a pályát. $a = 1$-nél az átlépés valószínűsége $e^{-2} \approx 0{,}1353$.

Ez a képlet a diszkréten figyelt barrier opciók **folytonossági (Broadie–Glasserman–Kou) korrekciójának** alapja: két megfigyelési időpont között az eszköz észrevétlenül átlépheti a korlátot, és minden intervallum túlélési valószínűségét $1 - e^{-2(a - w_0)(a - w_1)/\Delta}$-val szorozva visszakapjuk a folytonosan figyelt árat egy durva rácsból. Egyúttal megadja a szimulált futó maximum lefelé torzítását is: a rácson éppen azok a kimaradt átlépések, amelyeket ez a valószínűség mér.

## Hol jelenik meg a híd

- **Pálya-szimuláció:** a $W_t = B^0_t + t\,W_1$ felbontás kitölti a pályát ismert pontok között — ez a Brown-híd-mintavétel és a Monte Carlo varianciacsökkentés motorja.
- **Barrier opciók:** a rejtett átlépés képlete a diszkréten figyelt barrier opciók árát a folytonosan figyelt megfelelőjükre korrigálja.
- **Statisztika:** az empirikus eloszlásfüggvény, centrálva és skálázva, Brown-hídhoz konvergál; a Kolmogorov–Szmirnov-próba statisztikája a $|B^0|$ maximuma.
- **Interpoláció:** egy Gauss-folyamat megfigyelt értékekre való kondicionálása ugyanaz a művelet, amely a Gauss-folyamat-regresszió és a spline-simítás mögött áll.

### Kidolgozott példa: A 0-ból 1-be tartó híd az út negyedénél

1. $T = 1$ és $b = 1$ végpont mellett a $t = 0{,}25$-beli várható érték a 0-t és $b$-t összekötő egyenesen van.
   $$\mathbb{E}[X_{0{,}25}] = b\,\frac{t}{T} = 1 \cdot 0{,}25$$ → **0.25**
2. A variancia nem függ $b$-től.
   $$\operatorname{Var}(X_{0{,}25}) = \frac{t(T - t)}{T} = 0{,}25 \cdot 0{,}75$$ → **0.1875**
3. A gyöke a szórás, kisebb, mint a szabad Brown-mozgás $\sqrt{0{,}25} = 0{,}5$-e.
   $$\sqrt{0{,}1875}$$ → **0.433**

## Összefoglalás

- A 0-tól $b$-ig futó Brown-híd $B_t = W_t - t\,W_1 + t\,b$, ahol $B_0 = 0$ és $B_1 = b$.
- Gauss-folyamat $t\,b$ várható értékkel és $s(1 - t)$ kovarianciával ($s \le t$); a $t(1 - t)$ szórásnégyzet a végeken nulla, a felezőpontban $1/4$.
- A híd a $W_1 = b$-re kondicionált Brown-mozgás, és $B^0_t = W_t - t\,W_1$ független $W_1$-től, ami a $W_t = B^0_t + t\,W_1$ felbontást adja.
- Egy $w_0, w_1$-re rögzített híd egy $\Delta$ hosszúságú intervallumon $\exp(-2(a - w_0)(a - w_1)/\Delta)$ valószínűséggel lépi át az $a$ szintet; ez árazza és korrigálja a rácspontok közötti korlátátlépéseket.

[Szimulálj rögzített végű pályákat, és figyeld, ahogy a szórás a végpontokban nullára esik a Brown-mozgás laborban](https://quantsandbox.dev/hu/brownian-motion)

## Interaktív laborok

- [Brown-mozgás szimulátor drifttel és volatilitással](https://quantsandbox.dev/hu/brownian-motion)
- [Sztochasztikus analízis kurzus: a bolyongástól a Brown-mozgásig](https://quantsandbox.dev/hu/stochastic-models)

## Gyakorló kérdések

### 1. Mennyi egy $[0, 1]$-en értelmezett standard Brown-híd $\operatorname{Var}(B_{1/2})$ szórásnégyzete a felezőpontban?

**Válasz:** 0.25

$\operatorname{Var}(B_t) = t(1 - t)$, így $t = 1/2$-ben $\tfrac12 \cdot \tfrac12 = 1/4 = 0{,}25$, a parabola maximuma.

### 2. Egy $[0, 1]$-en értelmezett standard Brown-hídra számítsd ki $\operatorname{Cov}(B_{1/4}, B_{3/4})$-et.

**Válasz:** 0.0625

$s = 1/4 \le t = 3/4$ mellett $\operatorname{Cov}(B_s, B_t) = s(1 - t) = \tfrac14 \cdot \tfrac14 = 1/16 = 0{,}0625$.

### 3. Egy standard Brown-híd $t = 0$-ban és $t = 1$-ben is 0-ra van rögzítve. Mennyi annak valószínűsége, hogy közben eléri az $a = 1$ szintet?

**Válasz:** 0.1353

$w_0 = w_1 = 0$, $\Delta = 1$, $a = 1$ mellett: $\exp(-2(a - w_0)(a - w_1)/\Delta) = e^{-2 \cdot 1 \cdot 1} = e^{-2} \approx 0{,}1353$.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/brownian-bridge

Előző lecke: [A tükrözési elv és az első elérési idők](https://quantsandbox.dev/hu/guide/stochastic/reflection-principle)

Következő lecke: [Az Itô-integrál](https://quantsandbox.dev/hu/guide/stochastic/ito-integral)
