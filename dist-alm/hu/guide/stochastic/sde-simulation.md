# SDE-k szimulációja: az Euler–Maruyama-séma

Sztochasztikus differenciálegyenlet diszkretizálása, erős és gyenge hiba, lépésköz, és összevetés a geometriai Brown-mozgás pontos megoldásával.

A „Monte Carlo-opcióárazás” című leckében minden végső árat egyetlen lépésben sorsoltunk, mert „Az Itô-lemma” megadta a geometriai Brown-mozgás pontos megoldását. A gyakorlatban használt modellek többségére nincs ilyen képlet. Ez a lecke megmutatja, hogyan szimulálható egy sztochasztikus differenciálegyenlet lépésről lépésre az Euler–Maruyama-sémával, hogyan mérhető az általa elkövetett hiba, és milyen gyorsan csökken ez a hiba a lépések finomításával. Tesztesetként a geometriai Brown-mozgást használjuk, éppen azért, mert ismerjük a pontos megoldását.

## Sztochasztikus differenciálegyenletek

Egy **sztochasztikus differenciálegyenlet** (SDE) azt írja le, hogyan változik egy $X_t$ mennyiség egy rövid $dt$ idő alatt:

$$
dX_t = a(X_t, t)\,dt + b(X_t, t)\,dW_t.
$$

Az $a$ **drift** a várható változási ütem, a $b$ **diffúziós együttható** pedig egy Brown-mozgás $dW_t$ véletlen sokkját skálázza. A geometriai Brown-mozgás az $a = \mu X$, $b = \sigma X$ eset. Egy átlaghoz visszahúzó kamatlábnak vagy a „Sztochasztikus volatilitás és a Heston-modell” varianciájának más együtthatói vannak, és sokukra nincs zárt alakú megoldás.

## Az Euler–Maruyama-lépés

Osszuk fel a $[0, T]$ intervallumot $n$ darab $\Delta t = T/n$ hosszú lépésre, és minden lépés elején fagyasszuk be az együtthatókat. Egy lépés alatti Brown-növekmény normális eloszlású $\Delta t$ szórásnégyzettel, így felírható $\Delta W_k = \sqrt{\Delta t}\,Z_k$ alakban, ahol $Z_k$ standard normális. Az **Euler–Maruyama**-séma:

$$
X_{k+1} = X_k + a(X_k, t_k)\,\Delta t + b(X_k, t_k)\,\sqrt{\Delta t}\,Z_k.
$$

Ez a természetes első közelítés: pontosan azt a két tagot tartja meg, amely egy lépés változásának Itô-féle kifejtésében dominál, a $dt$-s és a $dW$-s tagot, a kisebbeket pedig elhagyja. Jó kép erre, ha egy kanyargós úton egyenes lépésekkel haladunk abba az irányba, amerre éppen nézünk: minél rövidebbek a lépések, annál közelebb maradunk az úthoz.

A geometriai Brown-mozgásra egy lépés $S_{k+1} = S_k\,(1 + \mu\,\Delta t + \sigma\,\Delta W_k)$, míg a pontos megoldás ugyanazon a lépésen

$$
S_{k+1} = S_k \exp\!\Big(\big(\mu - \tfrac12\sigma^2\big)\Delta t + \sigma\,\Delta W_k\Big).
$$

Példa: $S_0 = 100$, $\mu = 8\%$, $\sigma = 40\%$, $\Delta t = 0{,}25$ és $Z = 1$, tehát $\Delta W = 0{,}5$. Az Euler-lépés $100\,(1 + 0{,}02 + 0{,}2) = 122{,}00$-t ad. A pontos érték $100\,e^{(0{,}08 - 0{,}08) \cdot 0{,}25 + 0{,}2} = 100\,e^{0{,}2} = 122{,}14$. $Z = -1$ mellett az Euler-érték $82{,}00$, a pontos $81{,}87$. A lépés mindkét irányban nagyjából $0{,}13$-mal téved, mert figyelmen kívül hagyja az exponenciális görbületét.

## Erős és gyenge hiba

Egy szimulációs sémát kétféleképpen ítélhetünk meg, attól függően, mire használjuk.

- Az **erős hiba** $\mathbb{E}\big[\,|X_T - \hat X_T|\,\big]$ a szimulált $\hat X$ pályát ugyanazon Brown-mozgás által hajtott valódi pályával veti össze. Akkor számít, ha maga a pálya számít, például ha a pálya mentén fedezünk.
- A **gyenge hiba** $\big|\,\mathbb{E}[f(X_T)] - \mathbb{E}[f(\hat X_T)]\,\big|$ csak átlagokat hasonlít össze. Ez számít a Monte Carlo-árazásnál, amelynek $X_T$ eloszlására van szüksége, nem az egyes pályákra.

> Sima együtthatók esetén az Euler–Maruyama-séma erős rendje $\tfrac12$, gyenge rendje 1: az erős hiba $\sqrt{\Delta t}$-vel, a gyenge hiba $\Delta t$-vel arányosan csökken. Négyszer annyi lépés felezi az erős hibát, a gyenge hibát viszont negyedére csökkenti.

A geometriai Brown-mozgásnál a gyenge hiba könnyen kiszámolható. Minden Euler-lépés $1 + \mu\,\Delta t$-vel szorozza a várható értéket, így $\mathbb{E}[\hat S_T] = S_0\,(1 + \mu T/n)^n$, szemben a pontos $S_0\,e^{\mu T}$ értékkel. A fenti számokkal $100\,e^{0{,}08} = 108{,}3287$, az eltérés pedig $n = 4$, $16$ és $64$ esetén $0{,}0855$, $0{,}0216$ és $0{,}0054$: minden alkalommal a negyedére csökken.

### Kidolgozott példa: Az Euler-séma gyenge hibája GBM-re két lépéssel

1. $S_0 = 100$, $\mu = 8\%$, $T = 1$ és $n = 2$ mellett minden Euler-lépés ennyivel szorozza a várható értéket.
   $$1 + \mu T/n$$ → **1.04**
2. Az Euler-közelítés várható értéke $T$-ben.
   $$S_0\,(1 + \mu T/n)^n$$ → **108.16**
3. A pontos várható érték.
   $$S_0\,e^{\mu T}$$ → **108.3287**
4. A gyenge hiba: kétszerese az $n = 4$ melletti eltérésnek, ahogy az elsőrendű konvergencia mondja.
   $$S_0\,e^{\mu T} - S_0\,(1 + \mu T/n)^n$$ → **0.1687**

## Ugyanaz a pálya finomabb rácson

Az erős hiba csak úgy látható, ha a szimulációt ugyanazzal a véletlennel hajtott pontos pályával vetjük össze. Az ábra egy Brown-pályát rajzol egy 256 lépéses finom rácson egy évre, $S_0 = 100$, $\mu = 8\%$ és $\sigma = 40\%$ mellett; a nagy volatilitás teszi láthatóvá a hibát. A pontos megoldás ebből a pályából adódik, az Euler-közelítés pedig ugyanezt a pályát használja egy durvább rácson: minden durva növekmény az általa lefedett finom növekmények összege.

Válassz $n = 4$, $16$, $64$ vagy $256$ lépést, és figyeld, ahogy az Euler-pálya rásimul a pontosra; az „Új pálya” másik Brown-pályát sorsol. Vidd az egeret a grafikon fölé, vagy fókuszálj rá, és használd a nyílbillentyűket, hogy egy rácsidőpontban összevesd a két értéket. Alatta az 500 pálya átlagaként mért erős hiba látható $T$-ben, $\Delta t$ függvényében, log–log tengelyeken, egy $\tfrac12$ meredekségű referenciavonal mellett. A hiba $n = 4$ esetén nagyjából $4{,}82$, majd $2{,}34$, $1{,}23$ és $n = 256$-nál $0{,}63$: minden négyszeres finomítással nagyjából feleződik, ahogy a $\tfrac12$-es rend előre jelzi. Az első pályán $n = 16$ mellett a végső érték pontosan $177{,}23$, Euler-sémával $183{,}44$.

*[Interaktív ábra: euler convergence](https://quantsandbox.dev/hu/guide/stochastic/sde-simulation)*

## A logaritmus szimulálása

A geometriai Brown-mozgásnál van jobb megoldás annál, mint magát $S$-t diszkretizálni. „Az Itô-lemma” szerint $\ln S_t$ dinamikája

$$
d(\ln S_t) = \big(\mu - \tfrac12\sigma^2\big)\,dt + \sigma\,dW_t,
$$

amelynek együtthatói állandók. A $\ln S$-re alkalmazott Euler-lépések ezért tetszőleges $\Delta t$ mellett pontosak, és az árak automatikusan pozitívak maradnak. Az $S$-re alkalmazott Euler-séma akár negatív árat is adhat, ha $1 + \mu\,\Delta t + \sigma\,\Delta W$ nulla alá esik. Bevett fogás, hogy egy modellt a diszkretizálás előtt egyszerűbb együtthatójú változókra írunk át; ha ilyen átalakítás nincs, mint sok átlaghoz visszahúzó vagy sztochasztikus volatilitású modellnél, a kis lépésekre és a fenti hibarendekre támaszkodhatunk.

## Összefoglalás

- Egy $dX = a\,dt + b\,dW$ SDE-t lépésről lépésre szimulálunk az Euler–Maruyama-sémával: $X_{k+1} = X_k + a\,\Delta t + b\sqrt{\Delta t}\,Z_k$.
- Az erős hiba (pályák) rendje $\tfrac12$, a gyenge hibáé (átlagok) 1; a Monte Carlo-árazáshoz csak a gyenge kell.
- A durva és a finom rács csak ugyanazon a Brown-pályán hasonlítható össze: a durva növekmények a finomak összegei.
- Ha egy átalakítás állandó együtthatókat ad, ahogy $\ln S$ a geometriai Brown-mozgásnál, azt a változót szimuláljuk: a lépések pontossá válnak.

> Egy későbbi lecke, az „Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek”, egy olyan folyamatot vizsgál, amelynek driftje egy hosszú távú szint felé húzza vissza, és pontosan ilyen lépésekkel szimulálja.

[Szimulálj geometriai Brown-mozgás-pályákat a GBM laborban](https://quantsandbox.dev/hu/gbm)

## Interaktív laborok

- [Geometriai Brown-mozgás (GBM) szimulátor](https://quantsandbox.dev/hu/gbm)
- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)

## Gyakorló kérdések

### 1. Egy Euler-lépés geometriai Brown-mozgásra: $S_0 = 100$, $\mu = 8\%$, $\sigma = 40\%$, $\Delta t = 0{,}25$, a sorsolt érték $Z = -0{,}5$. Mennyi $S_1$?

**Válasz:** 92

$\Delta W = \sqrt{0{,}25} \cdot (-0{,}5) = -0{,}25$, így $S_1 = 100\,(1 + 0{,}08 \cdot 0{,}25 + 0{,}4 \cdot (-0{,}25)) = 100 \cdot 0{,}92 = 92$.

### 2. Az Euler-lépések számát 16-ról 256-ra növeled. Nagyjából mi történik az erős hibával?

- a) A felére csökken.
- b) Nagyjából a negyedére csökken.
- c) Nagyjából a tizenhatodára csökken.
- d) Nem változik.

**Válasz:** b) Nagyjából a negyedére csökken.

Az erős rend $\tfrac12$: a hiba $\sqrt{\Delta t}$ szerint skálázódik. Tizenhatszor több lépés $\sqrt{16} = 4$-szeresére csökkenti. Az elsőrendű gyenge hiba nagyjából a tizenhatodára esne.

---

Forrás: https://quantsandbox.dev/hu/guide/stochastic/sde-simulation

Előző lecke: [Monte Carlo-opcióárazás](https://quantsandbox.dev/hu/guide/stochastic/monte-carlo-pricing)

Következő lecke: [Korrelált Brown-mozgások és többeszközös modellek](https://quantsandbox.dev/hu/guide/stochastic/correlated-brownian-motions)
