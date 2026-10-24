# Kamatswapok

Fix és változó láb, a swap mint két kötvény, a par swapráta a diszkontfaktorokból, egy meglévő swap értéke és a DV01.

A kamatswap (kamatcsereügylet) a legtöbbet kereskedett kamatderivatíva. Két fél ugyanarra az összegre számolt kamatfizetéseket cserél: az egyik fix kamatot fizet, a másik változót, amelyet minden időszak elején újra rögzítenek. A lecke megmutatja, hogy a swap valójában két kötvény különbsége, beárazza az „Azonnali kamatok, forward kamatok és a hozamgörbe” című lecke diszkontfaktoraival, és levezeti a par swapkamatot. Épít a „Kötvényárak és hozamok” kötvényárazására is.

## Az egyszerű kamatswap

Az **egyszerű (plain-vanilla) kamatswapot** négy dolog határozza meg:

- a **névleges összeg** $N$, amelyre a kamatot számolják; ezt soha nem cserélik ki;
- a **fix kamatláb** $s$, amelyet ma rögzítenek az ügylet teljes futamidejére;
- minden időszakra egy **változó kamatláb** $L_i$: egy rövid lejáratú referenciakamat, amelyet az időszak elején, a **kamatfixálás napján** figyelnek meg, és az időszak végén fizetnek;
- a **kifizetési napok** $t_1 < t_2 < \dots < t_n$, a $\tau_i = t_i - t_{i-1}$ években mért kamatszámítási hányadokkal ($t_0 = 0$).

Minden $t_i$ napon a **fix láb** $N s\,\tau_i$ összeget, a **változó láb** $N L_i\,\tau_i$ összeget fizet. A gyakorlatban csak a különbség cserél gazdát. Aki fixet fizet és változót kap, az **fix fizető swapot** (payer swap) tart; a másik fél **fix kapó swapot** (receiver swap). A leckében a kifizetések évesek, így $\tau_i = 1$, a képletek azonban megtartják $\tau_i$-t, hogy bármilyen gyakoriságra érvényesek legyenek.

## A swap mint két kötvény

Adjunk hozzá mindkét lábhoz a $t_n$ lejáratkor egy képzeletbeli $N$ összegű tőkecserét. A két csere kiejti egymást, így a swap nem változik. Most viszont mindkét láb kötvény:

- a fix láb egy $N$ névértékű, időszakonként $s\,\tau_i$ kupont fizető **fix kamatozású kötvény**;
- a változó láb egy **változó kamatozású kötvény** (FRN), amelynek kuponja mindig az adott időszak változó kamata.

A fix kapó swap tehát long pozíció a fix kamatozású kötvényben és short pozíció az FRN-ben, a fix fizető swap ennek fordítottja. Értéke két kötvényár különbsége:

$$
V_{\text{kapó}} = B_{\text{fix}} - B_{\text{vált}}, \qquad V_{\text{fizető}} = B_{\text{vált}} - B_{\text{fix}}.
$$

## A változó kamatozású kötvény a kamatfixálás napján

Tegyük fel, hogy az $L_i$ változó kamat a $t_{i-1}$ és $t_i$ közötti hitelezés piaci kamata, ugyanaz, amelyből a diszkontfaktorok épülnek. Ekkor az FRN minden kamatfixálási napon pontosan a névértékét éri. Haladjunk visszafelé a végétől:

1. Az utolsó, $t_{n-1}$ fixálási napon a kötvény $t_n$-kor $N(1 + L_n\tau_n)$ összeget fog fizetni. Egy időszakot ugyanazzal az $L_n$ kamattal diszkontálva $N(1 + L_n\tau_n)/(1 + L_n\tau_n) = N$ adódik.
2. A $t_{n-2}$ napon a kötvény $t_{n-1}$-kor $N L_{n-1}\tau_{n-1}$ kupont fizet, és utána $N$-et ér. Ez együtt $N(1 + L_{n-1}\tau_{n-1})$, ami ismét $N$-re diszkontálódik.
3. Az érvelést mai napig visszafelé ismételve $B_{\text{vált}} = N$ adódik $t_0 = 0$-kor.

A szemléletes ok: a kupon mindig az aktuális piaci kamatot fizeti, ezért a kötvény fixáláskor sosem tér el a névértéktől. Két fixálási nap között is csak kicsit mozog, mert a következő kupon már rögzített.

## A fix láb és a par swapkamat

Jelölje $P(0,t)$ a diszkontfaktort, a $t$-kor fizetett 1 mai árát. A fix kamatozású kötvény ismert pénzáramokból áll, így

$$
B_{\text{fix}} = N s \sum_{i=1}^{n} \tau_i\,P(0,t_i) + N\,P(0,t_n).
$$

Az $A = \sum_i \tau_i P(0,t_i)$ összeg az **annuitásfaktor**: az évi 1 egység mai értéke a kifizetési napokon. Új swapot olyan fix kamattal kötnek, amely mellett mindkét félnek nulla az értéke, vagyis $B_{\text{fix}} = B_{\text{vált}} = N$. $N$-nel osztva és erre a kamatra rendezve kapjuk egy $n$ időszakos swap **par swapkamatát**, $S_n$-et:

$$
S_n = \frac{1 - P(0,t_n)}{\sum_{i=1}^{n} \tau_i\,P(0,t_i)} = \frac{1 - P(0,t_n)}{A}.
$$

> A par swapkamat egy névértéken forgó kötvény kuponja: $S_n = (1 - P(0,t_n))/A$, ahol $A = \sum_i \tau_i P(0,t_i)$ az annuitásfaktor.

## Hároméves számpélda

Legyenek a kifizetések évesek, a diszkontfaktorok pedig $P(0,1) = 0{,}9589$, $P(0,2) = 0{,}9160$ és $P(0,3) = 0{,}8730$. Ezek egy emelkedő görbéből származnak, nagyjából 4,28%, 4,49% és 4,63%-os éves kamatozású zérókamatokkal, a $P(0,t) = (1 + r(t))^{-t}$ összefüggés szerint; ez az alábbi ábra alapgörbéje. Az annuitásfaktor $A = 0{,}9589 + 0{,}9160 + 0{,}8730 = 2{,}7479$, és

$$
S_3 = \frac{1 - 0{,}8730}{2{,}7479} = \frac{0{,}1270}{2{,}7479} \approx 4{,}62\%.
$$

Ellenőrzés: egy 100 névértékre három évig évi 4,62-t fizető kötvény értéke $4{,}62 \cdot 2{,}7479 + 100 \cdot 0{,}8730 \approx 100{,}0$, vagyis névértéken forog, ahogy kell.

A diszkontfaktorokból adódó egyéves forward kamatok $f_i = P(0,t_{i-1})/P(0,t_i) - 1$: nagyjából 4,28%, 4,69% és 4,92%. A par swapkamat ezek között van. Ez a forward kamatok diszkontfaktorokkal súlyozott átlaga, $S_n = \sum_i \tau_i P(0,t_i)\,f_i / A$, ami az $1 - P(0,t_n) = \sum_i \big(P(0,t_{i-1}) - P(0,t_i)\big)$ azonosságból következik.

## Egy meglévő swap értéke

Megkötése után a kamatok elmozdulnak, és a swap értéke már nem nulla. Tegyük fel, hogy közvetlenül a fenti ügylet után az egész görbe fél százalékponttal felfelé tolódik, és a diszkontfaktorok $0{,}9543$, $0{,}9073$ és $0{,}8606$ lesznek. Az új annuitásfaktor $A' = 2{,}7222$, az új par kamat $S_3' = 0{,}1394/2{,}7222 \approx 5{,}12\%$.

Nézzük azt az $N = 10\,000\,000$ névleges összegű fix fizető swapot, amely a szerződéses $s = S_3 \approx 4{,}62\%$-os kamatot fizeti. A változó láb továbbra is $N$-et ér, a fix láb értéke viszont csökkent. Az ügylet értéke

$$
V_{\text{fizető}} = N\big[(1 - P(0,t_n)) - s\,A'\big] = N\,(S_n' - s)\,A' \approx 10\,000\,000 \times 0{,}00499 \times 2{,}7222 \approx 135\,900.
$$

A fix fizető nyer, mert 4,62% fizetését rögzítette, miközben ugyanerre a swapra most 5,12% a piaci kamat. A második alakot érdemes megjegyezni: egy meglévő swap értéke a mostani és a szerződéses swapkamat különbsége, az annuitásfaktorral szorozva.

Ugyanez a képlet adja az ügylet érzékenységét. Egy bázispontos (0,01%-os) swapkamat-változás nagyjából $N A \times 0{,}0001$-gyel változtatja az értéket. Ez a swap **DV01**-e, itt $10\,000\,000 \times 2{,}7222 \times 0{,}0001 \approx 2722$. Ugyanazt a szerepet tölti be, mint a duráció a „Duráció és konvexitás” című leckében.

Az ábra ennek a swapnak a pénzáramait egy időtengelyen mutatja. A fix fizető minden évben megkapja a változó kifizetést, egy $N f_i$ hosszú felfelé mutató nyilat (a várható értékét, a forward kamatból), és kifizeti az $N s$ fix összeget, egy lefelé mutató nyilat. Minden nyíl teli része a jelenértéke, a halvány maradék a diszkont. Vidd az egeret egy kifizetésre, fókuszáld vagy koppints rá, és látod az összegét, a $P(0,t_i)$ diszkontfaktort és a szorzást, amely a jelenértékét adja. A mai görbén a két láb ugyanannyit ér, így a swap értéke 0. Ezután állítsd a görbét +50 bázispontra: csak a változó nyilak nőnek, mert a fix kamatot 4,62%-on rögzítették, és a fix fizető számára az érték nagyjából 135 800 lesz, a fent kiszámolt szám. A 135 900-tól való kis eltérés a swapkamatok kerekítéséből adódik.

*[Interaktív ábra: swap timeline](https://quantsandbox.dev/hu/guide/fixed-income/interest-rate-swaps)*

Most essen a görbe: a teljes zérókupon-görbe fél százalékponttal lejjebb kerül, a diszkontfaktorok pedig $0{,}9635$, $0{,}9248$ és $0{,}8856$ lesznek.

### Kidolgozott példa: Ugyanaz a fix fizető swap 50 bázispontos esés után

1. Az új annuitásfaktor.
   $$A' = \sum_{i=1}^{3} P'(0,t_i)$$ → **2.7739**
2. Az új hároméves par swapkamat.
   $$S_3' = \frac{1 - P'(0,t_3)}{A'}$$ → **4.124%**
3. Az érték a fix fizetőnek, aki továbbra is $s = 4{,}62\%$-ot (pontosabban 4,622%-ot) fizet $N = 10\,000\,000$ névértékre.
   $$V_{\text{fix}} = N\,(S_3' - s)\,A'$$ → **-138100**
4. A DV01 az új görbén.
   $$N\,A' \times 0{,}0001$$ → **2774**

Az esés okozta veszteség kicsit nagyobb, mint az ugyanakkora emelkedés okozta nyereség, mert alacsonyabb kamatok mellett nagyobb az annuitásfaktor.

## A swapok felhasználása

- **Az adósság típusának megváltoztatása.** Egy vállalat, amely fix kamatozású kötvényt bocsátott ki, és fix kapó swapot köt, fixet kap és változót fizet, így összességében változó kamatot fizet. A fix fizető swap a változó kamatozású adósságot alakítja fixszé.
- **Kamatkockázat fedezése.** Egy bank, amelynek eszközei hosszú, fix kamatozású hitelek, a swapon fixet fizethet, így a kamatemelkedés már nem árt neki.
- **Kamatvárakozás kifejezése.** A fix fizető swap emelkedő kamatoknál nyer, a fix kapó csökkenőknél, kötvények vétele vagy eladása nélkül.

## Par swapkamatok és a zérókupon-görbe

Az ábra az $r(t) = \text{szint} + \text{meredekség}\,(1 - e^{-t/3})$ sima zérókupon-görbét használja éves kamatozással, így $P(0,t) = (1 + r(t))^{-t}$, ugyanazzal a konvencióval, mint az éves fix kifizetések. A **szint** a rövid vég kamata ($r(0) = \text{szint}$), a **meredekség** pedig azt adja meg, mennyivel van fölötte a hosszú vég: $t$ növekedésével $r(t)$ a szint + meredekség értékhez közelít. Minden $n$ lejáratra 1 és 10 év között megrajzolja az $r(n)$ zérókamatot és az $S_n$ par swapkamatot. A kijelzők az ötéves par swapkamatot, az ötéves annuitásfaktort, egy ötéves swap 1 000 000 névleges összegre vett DV01-ét és a tízéves par swapkamatot mutatják. Alapbeállításnál (4%-os szint, +1 százalékpontos meredekség) az ötéves swapkamat nagyjából 4,79%, szemben a 4,81%-os ötéves zérókamattal, az annuitásfaktor 4,3695, a DV01 körülbelül 437, a tízéves swapkamat pedig 4,94%, szemben a 4,96%-os zérókamattal. Állítsuk a meredekséget nullára: lapos görbénél a par swapkamat minden lejáraton egyenlő a zérókamattal. Emelkedő görbénél a swapkamat kicsivel az azonos lejáratú zérókamat alatt van, mert a korai, alacsonyabb forward kamatokat nagyobb súllyal veszi; a fenti példában $S_3 \approx 4{,}62\%$, míg a hároméves zérókamat 4,63%. Negatív meredekségnél a swapkamat kicsivel fölötte van.

*[Interaktív ábra: swap rate](https://quantsandbox.dev/hu/guide/fixed-income/interest-rate-swaps)*

## Összefoglalás

- A swap $N s\tau_i$ fix fizetéseket cserél $N L_i\tau_i$ változó fizetésekre egy soha ki nem cserélt névleges összegen.
- A fix kapó swap long pozíció egy fix kamatozású kötvényben és short egy változó kamatozásúban; ez utóbbi minden fixálási napon névértéket ér.
- A par swapkamat $S_n = (1 - P(0,t_n))/A$, ahol $A = \sum_i \tau_i P(0,t_i)$ az annuitásfaktor.
- Egy meglévő, $s$-et fizető fix fizető swap értéke $N(S_n' - s)A'$, DV01-e nagyjából $N A \times 0{,}0001$.

[Alakítsd a swapot árazó diszkontfaktorok görbéjét a Hozamgörbe laborban](https://quantsandbox.dev/hu/yield-curve)

## Interaktív laborok

- [Hozamgörbe-bootstrapping, spot és forward kamatlábak](https://quantsandbox.dev/hu/yield-curve)

## Gyakorló kérdések

### 1. Éves kifizetések, diszkontfaktorok: $P(0,1) = 0{,}96$ és $P(0,2) = 0{,}92$. Mekkora a kétéves par swapkamat? A választ százalékban add meg.

**Válasz:** 4.255%

$S_2 = (1 - 0{,}92)/(0{,}96 + 0{,}92) = 0{,}08/1{,}88 \approx 4{,}26\%$: egy mínusz az utolsó diszkontfaktor, osztva az annuitásfaktorral.

### 2. Par kamaton fix fizető swapot kötöttél (fixet fizetsz, változót kapsz). Másnap az egész görbe esik. Mennyit ér most a swapod?

- a) Kevesebbet nullánál: az új par kamatnál magasabb fix kamatot fizetsz.
- b) Többet nullánál: alacsonyabb kamatok mellett olcsóbb diszkontálni a fix kifizetéseket.
- c) Pontosan nullát: a változó láb névértéken marad.
- d) A névértéktől függ, nem a kamatoktól.

**Válasz:** a) Kevesebbet nullánál: az új par kamatnál magasabb fix kamatot fizetsz.

$V_{\text{fix}} = N\,(S_n' - s)\,A'$, és esés után $S_n' < s$, ezért az érték negatív. A változó láb valóban névértéken marad, de a fizetendő fix láb most többet ér.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/interest-rate-swaps

Előző lecke: [Kötvényfutures és a legolcsóbban szállítható kötvény](https://quantsandbox.dev/hu/guide/fixed-income/treasury-futures)

Következő lecke: [Visszahívható kötvények és negatív konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/callable-bonds)
