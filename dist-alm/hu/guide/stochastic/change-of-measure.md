# Mértékcsere és a Girsanov-tétel

Valószínűségek átsúlyozása sűrűséggel, ekvivalens mértékek, a Girsanov-tétel és a kockázat piaci ára.

Az opcióárazás ugyanazokhoz a kimenetelekhez két különböző valószínűségi mértéket használ: a valós $\mathbb{P}$ mértéket és a kockázatsemleges $\mathbb{Q}$ mértéket. A „Kockázatsemleges valószínűségek” című lecke egy egylépéses fán vezette be őket. Ez a lecke azt mutatja meg, hogyan lesz az egyik mértékből a másik a kimenetelek átsúlyozásával: először a fán, aztán a Brown-mozgásra, a „Véletlen bolyongás és Brown-mozgás” és „Az Itô-lemma” című leckék eszközeivel. A folytonos idejű eredmény a Girsanov-tétel.

## Két mérték ugyanazokon a kimeneteleken

Egy **valószínűségi mérték** minden eseményhez valószínűséget rendel. Két mértéknek lehet ugyanaz a lehetséges kimenetelhalmaza, és csak abban térnek el, mennyire valószínű az egyes kimenetel. Az egylépéses binomiális modellben a részvény felfelé vagy lefelé lép; $\mathbb{P}$ alatt a felfelé lépés valószínűsége $p$, $\mathbb{Q}$ alatt $q$. A kimenetelek, és így minden kifizetés, azonosak. Csak a súlyok különböznek.

Jó kép erre egy átsúlyozott dobókocka: a hat lap ugyanaz marad, csak az egyes lapok esélye változik. A mértékcsere a kocka átsúlyozása, nem az átfestése.

## A két mérték közötti sűrűség

Vezessünk be egy $Z$ valószínűségi változót, amely minden kimenetelben a két valószínűség hányadosa. A fán két értéket vesz fel:

$$
Z_u = \frac{q}{p}, \qquad Z_d = \frac{1-q}{1-p}.
$$

A $Z$-vel való szorzás a $\mathbb{P}$ szerinti várható értéket $\mathbb{Q}$ szerintivé alakítja. Bármely $X_u$ és $X_d$ értékű $X$ kifizetésre:

$$
\mathbb{E}^{\mathbb{P}}[Z X] = p\,\frac{q}{p}\,X_u + (1-p)\,\frac{1-q}{1-p}\,X_d = q X_u + (1-q) X_d = \mathbb{E}^{\mathbb{Q}}[X].
$$

Az $X = 1$ választás mutatja, hogy $\mathbb{E}^{\mathbb{P}}[Z] = 1$, és $Z$ minden kimenetelben pozitív. Az ilyen $Z$ általános neve **Radon–Nikodym-derivált**, jelölése $Z = d\mathbb{Q}/d\mathbb{P}$.

Példa: $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$ és $r = 2\%$ mellett a kockázatsemleges valószínűség $q = 0{,}4$. Legyen a valós valószínűség $p = 0{,}6$. Ekkor $Z_u = 0{,}4/0{,}6 \approx 0{,}667$ és $Z_d = 0{,}6/0{,}4 = 1{,}5$. Az ellenőrzés, $0{,}6 \cdot 0{,}667 + 0{,}4 \cdot 1{,}5 = 1$, teljesül. Egy 100-as kötési árú call esetén $X_u = 20$ és $X_d = 0$, így $\mathbb{E}^{\mathbb{P}}[ZX] = 0{,}6 \cdot 0{,}667 \cdot 20 = 8$, ami megegyezik $\mathbb{E}^{\mathbb{Q}}[X] = 0{,}4 \cdot 20 = 8$-cal. Diszkontálva a call ára $8/1{,}02 \approx 7{,}84$. A sűrűség csökkenti a kedvező kimenetel súlyát, és növeli a kedvezőtlenét.

## Ekvivalens mértékek

A sűrűségnek csak akkor van értelme, ha $p$ és $1 - p$ is pozitív, vagyis sehol sem osztunk nullával. Két mérték **ekvivalens**, ha ugyanazokat az eseményeket tartják lehetetlennek: egy esemény pontosan akkor nulla valószínűségű $\mathbb{P}$ alatt, ha $\mathbb{Q}$ alatt is az. Ekkor $Z$ szigorúan pozitív, és a mértékcsere $1/Z$-vel visszafordítható.

Az árazás szempontjából ez a lényeges feltétel. Az arbitrázs olyan stratégia, amely nem veszíthet, de nyerhet. Hogy valami lehetséges vagy lehetetlen, az ekvivalens mértékek alatt ugyanaz, ezért ami $\mathbb{P}$ alatt arbitrázsmentes piac, az $\mathbb{Q}$ alatt is az.

> Két mérték ekvivalens, ha ugyanazok a lehetetlen eseményeik. Ekvivalens mértékek között $\mathbb{E}^{\mathbb{Q}}[X] = \mathbb{E}^{\mathbb{P}}[ZX]$, ahol a $Z = d\mathbb{Q}/d\mathbb{P}$ sűrűség szigorúan pozitív és $\mathbb{E}^{\mathbb{P}}[Z] = 1$.

## Egy normális változó várható értékének eltolása

Legyen most a kimenetel folytonos. $\mathbb{P}$ alatt legyen $W_T \sim N(0, T)$, egy Brown-mozgás értéke a $T$ időpontban. Rögzítsünk egy $\theta$ számot, és legyen

$$
Z = \exp\!\left(-\theta W_T - \tfrac{1}{2}\theta^2 T\right).
$$

Ez pozitív, és $\mathbb{P}$ szerinti várható értéke 1, mert egy $T$ varianciájú normális változóra $\mathbb{E}[e^{-\theta W_T}] = e^{\frac12\theta^2 T}$. Szorozzuk meg $W_T$ normális sűrűségfüggvényét $Z$-vel, és alakítsuk teljes négyzetté a kitevőt:

$$
\frac{1}{\sqrt{2\pi T}}\,e^{-\frac{w^2}{2T}} \cdot e^{-\theta w - \frac12\theta^2 T} = \frac{1}{\sqrt{2\pi T}}\,e^{-\frac{(w + \theta T)^2}{2T}}.
$$

Az eredmény ismét normális sűrűség ugyanazzal a $T$ varianciával, de $-\theta T$ várható értékkel. A $Z$-vel való átsúlyozás oldalra tolta az eloszlást, az alakját nem változtatta meg. Az egyik oldal kimenetelei 1-nél nagyobb, a másik oldalé 1-nél kisebb súlyt kapnak.

### Kidolgozott példa: Egy normális változó átsúlyozása θ = 0,5 mellett

1. Legyen $W_1 \sim N(0, 1)$ a $\mathbb{P}$ alatt, $\theta = 0{,}5$ és $T = 1$. A $W_1 = 1$ kimenetel súlya.
   $$Z = e^{-\theta \cdot 1 - \frac12\theta^2}$$ → **0.5353**
2. A $W_1 = -1$ kimenetel súlya.
   $$Z = e^{\theta - \frac12\theta^2}$$ → **1.455**
3. $W_1$ várható értéke az átsúlyozott $\mathbb{Q}$ mérték alatt.
   $$-\theta T$$ → **-0.5**
4. $W_1$ szórásnégyzete $\mathbb{Q}$ alatt: az eloszlás alakja nem változik.
   $$T$$ → **1**

## A Girsanov-tétel

Ugyanez az átsúlyozás nemcsak a végpontra, hanem az egész pályára működik. A **Girsanov-tétel** szerint ha $W$ Brown-mozgás $\mathbb{P}$ alatt, és $\mathbb{Q}$-t a fenti $Z$ sűrűség definiálja, akkor

$$
\tilde W_t = W_t + \theta t
$$

Brown-mozgás $\mathbb{Q}$ alatt. Maguk a pályák nem változnak. Az új súlyok mellett $W$ időegységenként $-\theta$ driftet kap, és a $\theta t$ hozzáadása ezt tünteti el. Növekményekben $dW_t = d\tilde W_t - \theta\,dt$: a mértékcsere egy folyamat driftjét változtatja meg, a volatilitását nem.

## Geometriai Brown-mozgás a kockázatsemleges mérték alatt

Vegyük a „Geometriai Brown-mozgás” című lecke részvénymodelljét, $dS_t = \mu S_t\,dt + \sigma S_t\,dW_t$, és helyettesítsük be $dW_t = d\tilde W_t - \theta\,dt$-t:

$$
dS_t = (\mu - \sigma\theta)\,S_t\,dt + \sigma S_t\,d\tilde W_t.
$$

Válasszuk $\theta$-t úgy, hogy a drift a kockázatmentes $r$ kamat legyen:

$$
\theta = \frac{\mu - r}{\sigma}, \qquad dS_t = r S_t\,dt + \sigma S_t\,d\tilde W_t.
$$

A $\theta$ szám **a kockázat piaci ára**: a részvény többlethozama egységnyi volatilitásra vetítve. $\mathbb{Q}$ alatt a részvény átlagosan $r$-et hoz, ez a fán érvényes $\mathbb{E}^{\mathbb{Q}}[S_1] = (1+r)S_0$ folytonos idejű változata. Az Itô-lemmából, ahogy „Az Itô-lemma” című leckében,

$$
\ln\frac{S_T}{S_0} \sim N\!\left(\left(\mu - \tfrac12\sigma^2\right)T,\ \sigma^2 T\right) \text{ } \mathbb{P} \text{ alatt}, \qquad \ln\frac{S_T}{S_0} \sim N\!\left(\left(r - \tfrac12\sigma^2\right)T,\ \sigma^2 T\right) \text{ } \mathbb{Q} \text{ alatt}.
$$

Ez magyarázza, miért függnek az opcióárak $\sigma$-tól, de $\mu$-től nem. Az ár diszkontált $\mathbb{Q}$ szerinti várható érték, és $\mathbb{Q}$ alatt a drift $r$, bármekkora volt is $\mu$. A volatilitás túléli a mértékcserét, mert a Girsanov-tétel csak a várható értéket tolja el.

Példa: $\mu = 10\%$, $r = 3\%$, $\sigma = 20\%$, $T = 1$. A kockázat piaci ára $\theta = (0{,}10 - 0{,}03)/0{,}20 = 0{,}35$. A logaritmikus hozam várható értéke $\mathbb{P}$ alatt $0{,}10 - 0{,}02 = 0{,}08$, $\mathbb{Q}$ alatt $0{,}03 - 0{,}02 = 0{,}01$; a szórás mindkettőben $0{,}20$. Egy $W_1 = 1$ értékű pálya (jó év) súlya $Z = e^{-0{,}35 - 0{,}06125} \approx 0{,}663$, egy $W_1 = -1$ értékűé $e^{0{,}35 - 0{,}06125} \approx 1{,}335$.

Az ábra $T = 1$ mellett $\ln(S_T/S_0)$ sűrűségét mutatja $\mathbb{P}$ és $\mathbb{Q}$ alatt, valamint egy hisztogramvonalat: $\mathbb{P}$ alatt szimulált 200 000 húzást, $Z = d\mathbb{Q}/d\mathbb{P}$-vel átsúlyozva. Az átsúlyozott hisztogram közel esik a $\mathbb{Q}$-sűrűséghez; a kis eltérés mintavételi zaj. Mozgasd $\mu$-t: csak a $\mathbb{P}$-görbe mozdul, a $\mathbb{Q}$-görbe a helyén marad, az átsúlyozott minta pedig közel marad hozzá. Az $r$ a $\mathbb{Q}$-görbét tolja el, a $\sigma$ mindkettőt szélesíti. A kijelzők $\theta$-t, a $\mathbb{P}$ és $\mathbb{Q}$ szerinti várható értéket, valamint az átsúlyozott minta átlagát mutatják, amely közel marad a $\mathbb{Q}$ szerinti értékhez (alapbeállítással 0,94% az 1,00%-kal szemben).

*[Interaktív ábra: girsanov shift](https://quantsandbox.dev/hu/guide/stochastic/change-of-measure)*

## Összefoglalás

- Két mérték ugyanazokon a kimeneteleken csak a súlyokban tér el. A $Z = d\mathbb{Q}/d\mathbb{P}$ sűrűség váltja át az egyiket a másikba: $\mathbb{E}^{\mathbb{Q}}[X] = \mathbb{E}^{\mathbb{P}}[ZX]$.
- Az ekvivalens mértékeknek ugyanazok a lehetetlen eseményeik, ezért abban is egyetértenek, mi számít arbitrázsnak.
- Egy normális változót $e^{-\theta W_T - \frac12\theta^2 T}$-vel átsúlyozva a várható értéke $-\theta T$-vel eltolódik, a varianciája nem változik.
- Girsanov: $\tilde W_t = W_t + \theta t$ Brown-mozgás $\mathbb{Q}$ alatt. $\theta = (\mu - r)/\sigma$ mellett a részvény driftje $\mathbb{Q}$ alatt $r$.
- Az árak $\mathbb{Q}$ szerinti várható értékek, ezért $\sigma$-tól függnek, $\mu$-től nem.

> A következő lecke, a „Monte Carlo-opcióárazás”, közvetlenül $\mathbb{Q}$ alatt, $r$ drifttel szimulálja a részvényt, ahogy ez a lecke indokolja.

[Hasonlítsd össze a szimulált árfolyampályák driftjét és volatilitását a GBM laborban](https://quantsandbox.dev/hu/gbm)

## Interaktív laborok

- [Geometriai Brown-mozgás (GBM) szimulátor](https://quantsandbox.dev/hu/gbm)

## Gyakorló kérdések

### 1. Egy egylépéses fában a felfelé lépés valós valószínűsége $p = 0{,}5$, kockázatsemleges valószínűsége $q = 0{,}4$. Mennyi a $Z_u = d\mathbb{Q}/d\mathbb{P}$ sűrűség a felső állapotban?

**Válasz:** 0.8

$Z_u = q/p = 0{,}4/0{,}5 = 0{,}8$; az alsó állapotban $Z_d = 0{,}6/0{,}5 = 1{,}2$, és $0{,}5 \cdot 0{,}8 + 0{,}5 \cdot 1{,}2 = 1$.

### 2. Egy részvényre $\mu = 12\%$ és $\sigma = 25\%$, a kockázatmentes kamatláb $r = 4\%$. Mekkora a Girsanov-tételben használt $\theta$, a kockázat piaci ára?

**Válasz:** 0.32

$\theta = (\mu - r)/\sigma = 0{,}08/0{,}25 = 0{,}32$. $\mathbb{Q}$ alatt a $\mu$ drift helyére $r$ lép, így $\mu$ eltűnik az opciós árakból.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/change-of-measure

Előző lecke: [Kolmogorov-egyenletek és a Feynman–Kac-formula](https://quantsandbox.dev/hu/guide/stochastic/feynman-kac)

Következő lecke: [Monte Carlo-opcióárazás](https://quantsandbox.dev/hu/guide/stochastic/monte-carlo-pricing)
