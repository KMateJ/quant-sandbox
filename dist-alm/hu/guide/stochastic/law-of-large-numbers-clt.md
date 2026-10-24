# A nagy számok törvénye és a centrális határeloszlás-tétel

Miért állnak be az átlagok, milyen gyorsan, és miért bukkan fel a normális eloszlás: a Monte Carlo és a Brown-határátmenet mögötti két tétel.

A kurzus szinte minden szimulációja átlagolással végződik. A Monte Carlo-ár diszkontált kifizetések átlaga, a mintabeli volatilitás négyzetes hozamok átlaga, és a „Véletlen bolyongás és Brown-mozgás” lecke Brown-mozgása is átskálázott érmefeldobás-összegek határértéke. Két tétel magyarázza, miért viselkednek olyan szépen az átlagok: a **nagy számok törvénye** szerint az átlag beáll egy értékre, a **centrális határeloszlás-tétel** pedig azt mondja meg, hogyan ingadozik ez az érték körül. A lecke mindkettőt feltételeikkel együtt kimondja, az egyszerűbbet bizonyítja, egy ábrán pedig megmutatja, milyen gyorsan érvényesül a második. A „Hozamok és volatilitás” mintaátlagai és szórásnégyzetei az első átlagok, amelyekkel találkoztál.

## Független minták átlaga

Legyenek $X_1, X_2, \dots$ független, azonos eloszlású (i.i.d.) valószínűségi változók $\mu$ várható értékkel és véges $\sigma^2$ szórásnégyzettel. Az első $n$ **mintaátlaga** $\bar X_n = (X_1 + \cdots + X_n)/n$. A várható érték linearitása és az, hogy független változók szórásnégyzete összeadódik, két tényt ad, amelyre minden alább épül:

$$
E[\bar X_n] = \mu, \qquad \operatorname{Var}(\bar X_n) = \frac{\sigma^2}{n}.
$$

Az átlag átlagosan eltalálja a $\mu$-t, szórása, a $\sigma/\sqrt{n}$, azaz a **standard hiba** pedig $1/\sqrt{n}$ sebességgel csökken. Ennél többet egyelőre nem tételeztünk fel. A lecke további része azt kérdezi, mit jelent ez a csökkenés.

## A nagy számok gyenge törvénye

**Tétel (gyenge törvény).** Minden $\varepsilon > 0$-ra $P(|\bar X_n - \mu| > \varepsilon) \to 0$, ha $n \to \infty$. Ezt úgy mondjuk, hogy $\bar X_n$ **sztochasztikusan** konvergál $\mu$-höz. A bizonyítás a Csebisev-egyenlőtlenség, $P(|Y - E[Y]| \ge \varepsilon) \le \operatorname{Var}(Y)/\varepsilon^2$, az $Y = \bar X_n$ választással:

$$
P(|\bar X_n - \mu| \ge \varepsilon) \le \frac{\operatorname{Var}(\bar X_n)}{\varepsilon^2} = \frac{\sigma^2}{n\,\varepsilon^2} \xrightarrow[n \to \infty]{} 0.
$$

A Csebisev-korlát durva, de véges szórásnégyzeten kívül semmit sem igényel, és a csökkenő szórásnégyzet végzi el a munkát.

## Az erős törvény

**Tétel (erős törvény).** Ha $E|X_i| < \infty$, akkor $P(\bar X_n \to \mu) = 1$. A „valószínűséggel 1”, vagy **majdnem biztosan**, azt jelenti, hogy azoknak a mintasorozatoknak a halmaza, amelyekre az átlagok nem állnak be, nulla valószínűségű. A gyenge törvény minden rögzített $n$-et külön kezel. Az erős törvény a futó átlagok teljes pályáját kezeli, ahogy $n$ nő, és egyetlen hosszú szimuláció erre támaszkodik. Véges szórásnégyzet sem kell hozzá, csak véges várható érték. Bizonyítás nélkül mondjuk ki.

## A centrális határeloszlás-tétel

A törvények azt mondják meg, hová tart az átlag, azt nem, hogyan szóródik ez az érték körül. Az alak megismeréséhez standardizáljuk, hogy minden $n$-re 0 legyen a várható értéke és 1 a szórásnégyzete:

$$
Z_n = \frac{\bar X_n - \mu}{\sigma/\sqrt{n}} = \frac{X_1 + \cdots + X_n - n\mu}{\sigma\sqrt{n}}.
$$

**Tétel (centrális határeloszlás-tétel).** Ha az $X_i$ i.i.d. változók véges $\mu$ várható értékkel és véges, pozitív $\sigma^2$ szórásnégyzettel, akkor minden $z$-re

$$
P(Z_n \le z) \to \Phi(z) \quad (n \to \infty),
$$

ahol $\Phi$ a standard normális eloszlásfüggvény. A feltételek számítanak: függetlenség, közös eloszlás és véges szórásnégyzet. A forráseloszlás egyébként tetszőleges, ezért van normális határértéke a „Véletlen bolyongás és Brown-mozgás” bolyongásának, ha $\sqrt{n}$-nel átskálázzuk, pedig a lépései érmefeldobások. A gyakorlatban a tételt a $\bar X_n \approx N(\mu, \sigma^2/n)$ közelítésként használjuk nagy $n$-re.

## Milyen gyorsan: a Berry–Esseen-korlát

A tétel határértékről szól. Véges $n$-re közelítés, és a **Berry–Esseen-tétel** méri a hibáját. Ha $\rho_3 = E|X_i - \mu|^3$ véges, akkor

$$
\sup_z \left| P(Z_n \le z) - \Phi(z) \right| \le \frac{C\,\rho_3}{\sigma^3\sqrt{n}}, \qquad C \le 0{,}4748.
$$

A hiba $1/\sqrt{n}$ sebességgel csökken, és nagyobb, ha $\rho_3/\sigma^3$ nagy, vagyis ferde vagy nehéz farkú forrásoknál. Az egyenletes eloszlásnál körülbelül 1,30, az exponenciálisnál $12/e - 2 \approx 2{,}41$.

Az ábra a választott forrásból $n$ mintát átlagol, 4000-szer, minden átlagot standardizál, és a hisztogramot a standard normális sűrűségfüggvény mellé rajzolja. Az első mutató a **Kolmogorov-távolság**, a két eloszlásfüggvény legnagyobb eltérése. Exponenciális forrással és $n = 10$-zel körülbelül 0,05, $n = 100$-nál körülbelül 0,02, ami közel van ahhoz a 0,014-hez, amelyet 4000 átlagnál már a mintavételi zaj is okoz. Válts a $p = 0{,}1$ paraméterű Bernoulli-forrásra, egy nagyon ferde érmére: a távolság $n = 10$-nél körülbelül 0,24, $n = 100$-nál még mindig körülbelül 0,09. A Berry–Esseen-korlát óvatos, hiszen az exponenciális forrásnál $n = 10$-re 0,36-ot engedne meg, de az üzenete az, amit az ábra mutat: a ferde források lassabban konvergálnak. A második mutató, az átlag szimulált szórása minden $n$-nél egyezik a $\sigma/\sqrt{n}$-nel, ez a gyenge törvény működés közben.

*[Interaktív ábra: clt convergence](https://quantsandbox.dev/hu/guide/stochastic/law-of-large-numbers-clt)*

## Hol használjuk a tételeket

A Monte Carlo-ár a diszkontált kifizetések $\bar X_n$ mintaátlaga. Az erős törvény szerint a valódi árhoz konvergál. A centrális határeloszlás-tétel adja a hibasávot: a becslés a futások nagyjából 95%-ában a valódi értéktől legfeljebb $\pm 1{,}96\,\sigma/\sqrt{n}$-re van, ez a sáv tér vissza, amikor a kurzus opciókat áraz szimulációval. Mivel a hiba $1/\sqrt{n}$ sebességgel csökken, minden további helyes tizedesjegy százszor annyi mintába kerül.

### Kidolgozott példa: Egy Monte Carlo-becslés hibasávja

1. A kifizetések szórása 2, 10 000 minta átlagából: a standard hiba.
   $$\frac{\sigma}{\sqrt{n}} = \frac{2}{\sqrt{10\,000}}$$ → **0.02**
2. A 95%-os félszélesség 1,96 standard hiba.
   $$1{,}96 \times 0{,}02$$ → **0.0392**
3. A félszélesség felezéséhez a standard hibának is felére kell csökkennie, vagyis a mintaszámot meg kell négyszerezni.
   $$n_{\text{új}} = 4 \times 10\,000$$ → **40000**

Ugyanez a tétel áll a Brown-féle határérték mögött is. Egy 0 várható értékű és 1 szórásnégyzetű lépésekből álló bolyongás $n$ lépés után, $\sqrt{n}$-nel osztva standardizált összeg, így rögzített időpontban az eloszlása közelítőleg normális. A Brown-mozgás az a folytonos idejű objektum, amelynek minden időmetszete pontosan ilyen normális eloszlású.

## Összefoglalás

- Független, azonos eloszlású minták átlagának várható értéke $\mu$, standard hibája $\sigma/\sqrt{n}$.
- A gyenge törvény (Csebisevvel) szerint az átlag sztochasztikusan konvergál; az erős törvény szerint az átlagok egész sorozata majdnem biztosan konvergál, ehhez elég a véges várható érték.
- A centrális határeloszlás-tétel szerint a standardizált átlag normálissá válik, bármilyen is a forrás, ha a szórásnégyzet véges.
- A Berry–Esseen-tétel a hibát egy konstans szorosával korlátozza $1/\sqrt{n}$ sebességgel; a ferde források lassabban konvergálnak.

> A következő lecke, a „Valószínűségi mezők, σ-algebrák és valószínűségi változók”, pontosan definiálja, mit jelent a „valószínűséggel 1” és a „valószínűségi változó”.

[Figyeld a centrális határeloszlás-tételt a Sztochasztikus Stúdióban](https://quantsandbox.dev/hu/stochastic-models/clt)

## Interaktív laborok

- [Sztochasztikus analízis kurzus: a bolyongástól a Brown-mozgásig](https://quantsandbox.dev/hu/stochastic-models)
- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)

## Gyakorló kérdések

### 1. A függetlenségen és a közös eloszláson kívül melyik feltételt igényli a klasszikus centrális határeloszlás-tétel?

- a) Véges szórásnégyzetet
- b) Korlátos értékkészletet
- c) Szimmetrikus eloszlást
- d) Normális forráseloszlást

**Válasz:** a) Véges szórásnégyzetet

Csak véges, pozitív szórásnégyzet kell. A forrás lehet ferde, diszkrét vagy korlátlan; a végtelen szórásnégyzetű, nehéz farkú eloszlásoknál mondja fel a tétel a szolgálatot.

### 2. Egy 2500 mintán alapuló Monte Carlo-becslés standard hibája 0,05. Hány minta kell 0,01-es standard hibához?

**Válasz:** 62500

A standard hiba $1/\sqrt{n}$ szerint csökken. A 0,05-ről 0,01-re ötszörös csökkenés $5^2 = 25$-szörös mintaszámot kíván: 2500-ról 62 500-ra.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/law-of-large-numbers-clt

Előző lecke: [Véletlen bolyongás és Brown-mozgás](https://quantsandbox.dev/hu/guide/stochastic/random-walks)

Következő lecke: [Valószínűségi mezők, σ-algebrák és valószínűségi változók](https://quantsandbox.dev/hu/guide/stochastic/probability-spaces)
