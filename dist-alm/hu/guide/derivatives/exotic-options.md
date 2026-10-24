# Egzotikus opciók: korlátos, ázsiai és digitális opciók

Útfüggő kifizetések, a kiütési korlát és az átlagár hatása, és miért természetes itt a Monte Carlo-árazás.

Ezen a pályán eddig minden opció kizárólag a végső $S_T$ ár függvényét fizette. Ez a lecke olyan opciókat vizsgál, amelyek kifizetése vagy nem szokványos, vagy a teljes árfolyamúttól függ: a digitális, a barrier és az ázsiai opciókat. A „Kockázatsemleges valószínűségek” árazási szabályára, „A Black–Scholes-képlet” eredményére és a „Monte Carlo-opcióárazás” szimulációs módszerére épít, és megmutatja, hol nem működik már a „Statikus replikáció: Breeden–Litzenberger és Carr–Madan” lecke statikus replikációja.

## Egzotikus opciók

**Egzotikusnak** nevezünk egy opciót, ha nem egyszerű európai vagy amerikai call vagy put. A szokványos szerződéstől kétféleképpen lehet eltérni. A kifizetés lehet $S_T$ más függvénye, például egy rögzített pénzösszeg. Vagy a kifizetés lehet **útfüggő**: a $T$ előtti árfolyamoktól is függ, például az út maximumától vagy átlagától.

A különbség a fedezésnél számít. Egy $f(S_T)$ európai kifizetés statikusan felépíthető kötvényekből, határidős ügyletből és egyszerű opciókból, ahogy a Carr–Madan-felbontás megmutatta. Útfüggő kifizetésre ez általában nem igaz: két út, amely ugyanabban az $S_T$-ben ér véget, eltérő összeget fizethet, így $S_T$ függvényét fizető eszközökből álló portfólió nem képes követni. Az árazási szabály viszont nem változik: az ár továbbra is az $X$ kifizetés diszkontált $\mathbb{Q}$ szerinti várható értéke:

$$
V_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[X].
$$

## Digitális opciók

A **digitális** (cash-or-nothing) call $T$-ben 1-et fizet, ha $S_T > K$, egyébként semmit. Kifizetése az $\mathbf{1}\{S_T > K\}$ indikátor: lépcső, nem rámpa. A várható kifizetés annak kockázatsemleges valószínűsége, hogy az ár a kötési ár fölött zár; „A Black–Scholes-képlet” ezt $N(d_2)$-ként azonosította. Diszkontálva

$$
D_0 = e^{-rT}\,\mathbb{Q}(S_T > K) = e^{-rT} N(d_2), \qquad d_2 = \frac{\ln(S_0/K) + (r - \tfrac12\sigma^2)T}{\sigma\sqrt{T}}.
$$

$S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$ és $T = 1$ mellett $d_2 = 0{,}03/0{,}2 = 0{,}15$, $N(d_2) \approx 0{,}5596$ és $D_0 \approx 0{,}5323$. A digitális opció még európai kifizetés: a „Pozíciók kombinálása” lecke szűk call-spreadjének határesete, ahol $1/h$ darab $K$ kötési árú callt veszünk és $1/h$ darab $K + h$ kötési árú callt eladunk, $h \to 0$ mellett.

A deltája mutatja, miért nehéz fedezni. $D_0$-t $S_0$ szerint deriválva $\Delta = e^{-rT}\varphi(d_2)/(S_0\sigma\sqrt{T})$, ahol $\varphi$ a standard normális sűrűségfüggvény. Az $1/\sqrt{T}$ tényező miatt a pénznél lévő opció deltája a lejárat közeledtével felrobban: egy évvel a lejárat előtt kb. $0{,}019$, egy hónappal előtte $0{,}069$, egy nappal előtte $0{,}381$. A lejárat közelében a fedezőpozíciónak szinte semmiből nagy pozícióba kell átlendülnie, ahogy az ár átlépi $K$-t.

### Kidolgozott példa: Egy pénzen kívüli digitális call

1. Ugyanaz a piac, a kötési ár $K = 110$-re nő:
   $$d_2 = \frac{\ln(100/110) + (0{,}05 - 0{,}02) \cdot 1}{0{,}2}$$ → **-0.3266**
2. Annak kockázatsemleges valószínűsége, hogy az ár 110 fölött zár:
   $$N(d_2)$$ → **0.372**
3. Diszkontáljuk az 1-es kifizetés várható értékét:
   $$D_0 = e^{-0{,}05} \cdot 0{,}372$$ → **0.3539**

## Barrier opciók

A **barrier opció** olyan egyszerű opció, amely kikapcsol vagy bekapcsol, ha az árfolyam eléri a $B$ szintet. A **kiütéses** (knock-out) opció megszűnik és semmit sem fizet, ha az árfolyam $T$ előtt eléri a korlátot; a **beütéses** (knock-in) opció csak akkor lép életbe, ha eléri. A leggyakoribb példa a $B > K$ korlátú **felső kiütéses call** (up-and-out call). Jelölje $M_T$ az út maximumát $T$-ig; ekkor a kifizetés

$$
X = (S_T - K)^+\,\mathbf{1}\{M_T < B\}.
$$

Ez a kifizetés sosem nagyobb az egyszerű callénál, ezért a felső kiütéses call olcsóbb. Éppen azokat az utakat veszíti el, amelyek a call tulajdonosának a legtöbbet érnék: a nagyot emelkedőket. Ha $B$ a $K$ felé csökken, az értéke nullához tart, hiszen egy $K \ge B$ fölött záró útnak érintenie kellett $B$-t. Ha $B$ nő, a korlátot egyre ritkábban érik el, és az ár az egyszerű call árához közelít.

A volatilitás két irányba hat. Nagyobb $\sigma$ mellett valószínűbbek a nagy végső kifizetések, ez emeli az egyszerű call árát, de valószínűbb az is, hogy az út eléri $B$-t. Ha a korlát közel van az azonnali árfolyamhoz, a második hatás erősebb, és a felső kiütéses call $\sigma$ növelésével olcsóbbá válhat.

## Be–ki paritás

Tartsunk egy felső beütéses és egy felső kiütéses callt ugyanazzal a $K$, $B$ és $T$ paraméterrel. Minden úton pontosan az egyik él, és az élő $(S_T - K)^+$-t fizet. Együtt tehát minden úton az egyszerű call kifizetését adják, így az egy ár törvénye szerint

$$
C_0^{\text{in}} + C_0^{\text{out}} = C_0.
$$

A két barrier opció közül az egyiket beárazva a másik ára is adott.

## Diszkrét és folytonos megfigyelés

A szerződésnek rögzítenie kell, hogyan ellenőrzik a korlátot. A tankönyvi képletek **folytonos megfigyelést** feltételeznek: az árfolyamot minden pillanatban figyelik. A valódi szerződések gyakran **diszkrét megfigyelést** használnak, például minden napi záróárnál. Egy út két megfigyelési időpont között átlépheti $B$-t, majd észrevétlenül visszatérhet, ezért a diszkréten megfigyelt kiütéses opciót ritkábban ütik ki, és többet ér folytonosan megfigyelt változatánál. Az alábbi ábra az év során 100 időpontban figyel.

## Ázsiai opciók

Az **ázsiai opció** a végső ár helyett a $t_1, \dots, t_n$ megfigyelési időpontokban mért árak átlagára fizet. A számtani átlagra szóló ázsiai call kifizetése

$$
X = (A_T - K)^+, \qquad A_T = \frac{1}{n}\sum_{k=1}^{n} S_{t_k}.
$$

Az átlag kevésbé mozog, mint maga az árfolyam: az átlag korai tagjainak kevés idejük volt elsodródni, és az eltéréseik részben kioltják egymást. A teljes időszakra vett átlag volatilitása nagyjából $\sigma/\sqrt{3}$, $\sigma = 20\%$ mellett kb. 11,5%. Kisebb volatilitás kisebb időértéket jelent, ezért az ázsiai call olcsóbb az egyszerűnél. Az átlagolás ráadásul megnehezíti, hogy valaki egyetlen nap árfolyamának mozgatásával befolyásolja a kifizetést.

Lognormális árak összege nem lognormális, ezért a számtani átlagú ázsiai callra nincs zárt képlet. A mértani átlag lognormális, és van rá Black–Scholes-típusú képlet; mivel szorosan együtt mozog a számtanival, a „Monte Carlo-opcióárazás” értelmében természetes kontrollváltozó.

## Árazás Monte Carlo-módszerrel

Útfüggő kifizetésnél nem elég $S_T$ egyetlen sorsolása: a teljes útra szükség van a megfigyelési időpontokban. $\mathbb{Q}$ alatt a részvény $r$ driftű geometriai Brown-mozgást követ, és a pontos megoldás $\Delta t = T/n$ lépésekben halad egyik időpontról a következőre:

$$
S_{t_{k+1}} = S_{t_k}\exp\big((r - \tfrac12\sigma^2)\Delta t + \sigma\sqrt{\Delta t}\,Z_{k+1}\big).
$$

1. Szimulálj $N$ utat az $n$ megfigyelési időpontban független standard normális $Z$-kkel.
2. Minden úton jegyezd fel, amire a kifizetésnek szüksége van: $S_T$, a futó maximum $M_T$, az átlag $A_T$.
3. Számold ki minden út kifizetését, átlagold az $N$ útra, és szorozd meg $e^{-rT}$-vel.

Ugyanazok az utak egyszerre árazzák az összes szerződést; csak a kifizetésfüggvény változik. A standard hiba úgy viselkedik, ahogy a „Monte Carlo-opcióárazás” lecke leírta.

## Számpélda

Legyen $S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$, $\sigma = 20\%$, 100 megfigyelési időpont, $B = 130$ korlát, és szimuláljunk 20 000 utat (1-es seed). A becslések:

- Egyszerű call: $10{,}37$; a Black–Scholes-ár $10{,}45$, nagyjából egy standard hibán ($\approx 0{,}10$) belül.
- Ázsiai call: $5{,}77$, az egyszerű call árának valamivel több mint fele.
- Felső kiütéses call $B = 130$ mellett: $3{,}69$, így a be–ki paritás szerint a felső beütéses call értéke $10{,}37 - 3{,}69 = 6{,}68$.
- Az 1-et fizető digitális call: $0{,}530$, szemben a zárt $e^{-rT}N(d_2) \approx 0{,}532$ értékkel.

A korlát az egyszerű call értékének csaknem kétharmadát elviszi, mert 20%-os volatilitás mellett egy év alatt egy 30%-os emelkedés nem ritka.

Az ábra ezekkel a beállításokkal dolgozik: $S_0 = 100$, $K = 100$, $r = 5\%$, $T = 1$, 20 000 $\mathbb{Q}$ alatt szimulált út, 100 megfigyelési időponttal. A csúszkák a $\sigma$ volatilitást (10%-tól 50%-ig) és a $B$ korlátszintet (105-től 250-ig) állítják, az „Új minta” gomb új utakat sorsol. A grafikon a felső kiütéses call árát mutatja $B$ függvényében 105 és 250 között, az egyszerű call Black–Scholes-árával mint vízszintes vonallal és egy függőleges vonallal a választott $B$-nél. A kijelzők a Monte Carlo-val becsült egyszerű callt, az ázsiai callt, a $B$ korlátú felső kiütéses callt és az 1-et fizető digitális callt mutatják. Told le $B$-t $K$ felé, és figyeld, ahogy a barrier opció ára nullára esik. Aztán emeld $\sigma$-t: az egyszerű call drágul, a $B = 130$ korlátú felső kiütéses call viszont olcsóbb lesz, 20%-nál kb. $3{,}69$-ről 30%-nál kb. $1{,}88$-ra.

*[Interaktív ábra: exotic prices](https://quantsandbox.dev/hu/guide/derivatives/exotic-options)*

> Az útfüggő opciókra ritkán van zárt képlet, de ugyanazzal a szabállyal árazhatók, mint bármely más követelés: szimulálj utakat $\mathbb{Q}$ alatt, értékeld ki a kifizetést minden úton, átlagold és diszkontáld.

## Összefoglalás

- Egzotikus az az opció, amelynek kifizetése nem szokványos vagy az úttól függ; útfüggő kifizetés általában nem replikálható statikusan egyszerű opciókkal.
- A digitális call 1-et fizet, ha $S_T > K$; ára $e^{-rT}N(d_2)$, deltája a lejárat előtt a pénznél kiugrik.
- A felső kiütéses call olcsóbb az egyszerűnél, értéke nullához tart, ahogy $B$ közelít $K$-hoz, és teljesül $C_0^{\text{in}} + C_0^{\text{out}} = C_0$; diszkrét megfigyelésnél ritkábban ütik ki.
- Az átlagolás csökkenti a volatilitást, ezért a számtani átlagú ázsiai call olcsóbb az egyszerűnél, és nincs rá zárt képlet.
- A Monte Carlo-módszer ugyanazokból a megfigyelési időpontokban szimulált utakból mindegyiket beárazza.

[Szimulálj kockázatsemleges utakat és árazz kifizetéseket a Monte Carlo laborban](https://quantsandbox.dev/hu/monte-carlo)

## Interaktív laborok

- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)
- [Opciós kifizetési diagram és stratégiaépítő](https://quantsandbox.dev/hu/payoff)

## Gyakorló kérdések

### 1. Egy cash-or-nothing call 1-et fizet, ha $S_T > K$. $S_0 = K = 100$, $r = 5\%$, $\sigma = 20\%$ és $T = 1$ mellett mennyit ér ma?

**Válasz:** 0.5323

$d_2 = 0{,}15$ és $N(0{,}15) \approx 0{,}5596$, így $D_0 = e^{-0{,}05} \cdot 0{,}5596 \approx 0{,}5323$.

### 2. Hasonlíts össze egy felső kiütéses callt ($B > K$ korláttal) az azonos $K$ kötési árú és $T$ lejáratú egyszerű callal.

- a) A felső kiütéses call kevesebbet ér
- b) A felső kiütéses call többet ér
- c) Ugyanannyit érnek
- d) Attól függ, eléri-e az ár $B$-t

**Válasz:** a) A felső kiütéses call kevesebbet ér

Minden úton a barrier opció kifizetése legfeljebb akkora, mint az egyszerűé, és a $B$-t elérő utakon nulla, miközben az egyszerű call fizethet. Ezért olcsóbb, éppen a felső beütéses call értékével.

---

Forrás: https://quantsandbox.dev/hu/guide/derivatives/exotic-options

Előző lecke: [Statikus replikáció: Breeden–Litzenberger és Carr–Madan](https://quantsandbox.dev/hu/guide/derivatives/static-replication)
