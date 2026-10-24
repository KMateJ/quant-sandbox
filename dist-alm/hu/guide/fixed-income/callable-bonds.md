# Visszahívható kötvények és negatív konvexitás

A kibocsátó visszahívási opciója, az ár összenyomódása a visszahívási ár közelében, a visszahívásig számított hozam és a negatív konvexitás.

A „Kötvényárak és hozamok” és a „Duráció és konvexitás” című lecke olyan kötvényeket árazott, amelyek pénzáramai előre rögzítettek. Sok vállalati és állami ügynökségi kötvény nem ilyen: a kibocsátó korábban visszafizetheti. Ez a lecke ezt a jogot a kibocsátó kezében lévő opcióként kezeli, megmutatja, hogyan korlátozza a kötvény árát, amikor a hozamok csökkennek, és megmagyarázza, miért lehet egy ilyen kötvény konvexitása negatív. Az opciókat a „Határidős ügyletek, call és put opciók” című lecke vezette be; itt csak annyi kell, hogy az opció jog, kötelezettség nélkül. Jelölés: $F = 100$ névérték, éves $c$ kupon, éves kamatozású $y$ hozam, $P$ ár.

## A visszahívási jog

A **visszahívható kötvényt** a kibocsátó egy rögzített **visszahívási áron**, többnyire névértéken, visszavásárolhatja a tulajdonostól egy első visszahívási időponttól kezdve. Az ezt megelőző évek a **visszahívási védelem** időszaka. Vegyünk egy tízéves, 6%-os kuponú kötvényt, amely 3 év után 100-on visszahívható. Ha a kibocsátó piaci hozama 4%-ra csökken, egy új hétéves kötvény évi 6% helyett 4%-ba kerülne neki. Ekkor 100-on visszahívja a régi kötvényt, és újrafinanszírozza magát. Ha a hozamok nőnek, megtartja az olcsó, 6%-os adósságot. A tulajdonos mindkét irányban a rosszabbik kimenetet kapja: alacsony újrabefektetési kamatot, ha visszahívják a kötvényt, és csökkenő árat, ha nem.

## A visszahívható kötvény mint fix kötvény mínusz egy call opció

A visszahívható kötvény tartása ugyanaz, mint egy azonos kuponú és lejáratú, nem visszahívható **fix kötvény** tartása, miközben a tulajdonos eladott a kibocsátónak egy call opciót erre a kötvényre, a visszahívási árral mint kötési árral:

$$
P_{\text{visszahívható}} = P_{\text{fix}} - C_{\text{opció}}.
$$

Az opciónak azért van értéke, mert a jövőbeli hozam bizonytalan. Egy kétállapotú szemléltetés: tegyük fel, hogy 3 év múlva a hozam vagy 4%, vagy 8%, mindkettő fél valószínűséggel, és a diszkontálás 5%-kal történik. A hátralévő hétéves kötvény ekkor $112{,}00$-t vagy $89{,}59$-et ér. Az alacsony hozamú állapotban a kibocsátó visszahívja és 100-at fizet, így $12{,}00$-t vesz el a tulajdonostól; a magas hozamú állapotban nem történik semmi. Ma az opció nagyjából ennyit ér:

$$
C_{\text{opció}} \approx \frac{\tfrac{1}{2}\,(112{,}00 - 100)}{1{,}05^{3}} \approx 5{,}18.
$$

> A visszahívható kötvény egy fix kötvény mínusz a kibocsátónak eladott call opció. A tulajdonos az opcióért alacsonyabb árat, azaz magasabb hozamot kap, mint egy hasonló fix kötvényen.

Ismételjük meg a kétállapotú példát szélesebb tartománnyal: 3 év múlva a hozam 3% vagy 7%, ismét fele-fele valószínűséggel, 5%-os diszkontálással.

### Kidolgozott példa: A visszahívási opció értéke két állapotban, 3%-os vagy 7%-os hozammal

1. A hátralévő 7 éves, 6%-os kötvény értéke 3 év múlva 3%-os hozamnál.
   $$B_{\text{alacsony}} = \sum_{t=1}^{7} \frac{6}{1{,}03^t} + \frac{100}{1{,}03^7}$$ → **118.69**
2. Az értéke 7%-os hozamnál; ekkor a kibocsátó nem hívja vissza.
   $$B_{\text{magas}} = \sum_{t=1}^{7} \frac{6}{1{,}07^t} + \frac{100}{1{,}07^7}$$ → **94.61**
3. A visszahívási opció mai értéke: a $\max(B - 100, 0)$ kifizetés várható értéke, 3 évre diszkontálva.
   $$C_{\text{call}} = \frac{\tfrac{1}{2}\,\max(B_{\text{alacsony}} - 100,\,0)}{1{,}05^{3}}$$ → **8.07**
4. A visszahívható kötvény ára; a fix kötvény ára 107,72 (a lenti számpéldából).
   $$P_{\text{fix}} - C_{\text{call}}$$ → **99.65**

A jövőbeli hozamok szélesebb szóródása értékesebbé teszi az opciót (5,18 helyett 8,07), a visszahívható kötvényt pedig olcsóbbá.

## Lejáratig, visszahívásig és legrosszabb esetre számított hozam

Egy visszahívható kötvénynek több természetes hozama van. A **lejáratig számított hozam** feltételezi, hogy a kötvényt soha nem hívják vissza. A **visszahívásig számított hozam** feltételezi, hogy az első visszahívási időpontban visszahívják: addig kuponokat fizet, utána a visszahívási árat. A befektetők általában a **legrosszabb hozamot** jegyzik, a kettő közül az alacsonyabbat, mert a kibocsátó a számára olcsóbb, vagyis a tulajdonos számára rosszabb kimenetet választja.

## Számpélda

A tízéves, 6%-os kötvény fix változata 5%-os piaci hozam mellett

$$
P_{\text{fix}} = \sum_{t=1}^{10} \frac{6}{1{,}05^{t}} + \frac{100}{1{,}05^{10}} \approx 107{,}72.
$$

Az opciót a kötvényre szóló opcióként értékeljük az első visszahívási időpontban: 3 év múlva a hozam bizonytalan (lognormális 5% körül, évi 20%-os volatilitással), a kibocsátó akkor hív vissza, ha a hátralévő hétéves kötvény 100-nál többet ér, és a kifizetést visszadiszkontáljuk. Így $C_{\text{opció}} \approx 7{,}13$, a visszahívható kötvény tehát nagyjából $100{,}59$-et ér. Ezen az áron:

- lejáratig számított hozam: 5,92%;
- visszahívásig számított hozam (3 évig kupon, utána 100): 5,78%;
- legrosszabb hozam: 5,78%.

Az 5%-os piaci hozam és a visszahívható kötvény lejáratig számított hozama közötti 92 bázispont, illetve az árban mutatkozó 7,13 pont a tulajdonos ellentételezése a visszahívási jogért.

## Árkompresszió és negatív konvexitás

Csökkenő hozamok mellett a fix kötvény ára tovább emelkedik. A visszahívható kötvényé sokkal kevésbé, mert a magasabb ár valószínűbbé teszi a visszahívást: az ára a visszahívási ár felé nyomódik össze. 5%-ról 4%-ra a fix kötvény $8{,}50$-et nyer, a visszahívható csak $4{,}09$-et. 5%-ról 6%-ra a fix kötvény $7{,}72$-t veszít, a visszahívható $4{,}75$-öt. A durációt és a konvexitást ezért a tényleges árfüggvényen mérjük, a hozamot egy kis $\Delta y$-nal mindkét irányba eltolva:

$$
D_{\text{eff}} = \frac{P_{-} - P_{+}}{2\,P\,\Delta y}, \qquad C_{\text{eff}} = \frac{P_{+} + P_{-} - 2P}{P\,(\Delta y)^2}.
$$

5%-on, $\Delta y = 0{,}1\%$-kal a visszahívható kötvény **effektív durációja** nagyjából 4,42, szemben a fix kötvény 7,52-es módosított durációjával, **effektív konvexitása** pedig nagyjából $-68$, szemben a $+72$-vel. A negatív konvexitás azt jelenti, hogy az árgörbe rossz irányba hajlik: a tulajdonos többet veszít a hozamok emelkedésén, mint amennyit ugyanakkora csökkenésen nyer. Ott jelentkezik, ahol a visszahívási jog értékes, a kuponráta körül és alatta. Magas hozamoknál a jog szinte semmit sem ér, és a visszahívható kötvény ismét úgy viselkedik, mint a fix.

Hosszabb visszahívási védelem csökkenti az opció értékét: 5%-on 5 év védelemmel az opció 5,53-at ér és a kötvény 102,20-at; ha az első kuponfizetéstől visszahívható, az opció 7,74-et ér és a kötvény 99,98-at. Ez a modell szándékosan egyszerű: csak az első visszahívási időpontban enged visszahívást. Egy teljes értékelés a védelmi időszak után minden időpontban megengedi a visszahívást, és a jövőbeli kamatlábak fáját építi fel, a „Többlépéses fák és visszafelé indukció” szellemében.

Az ábrán a fix kötvény ár–hozam görbéje a visszahívható kötvényé fölött fut, a kettő közötti sáv a visszahívási opció értéke. Húzd a pontot a hozamtengely mentén, vagy jelöld ki és használd a nyílbillentyűket. A szaggatott vonal az érintő az adott hozamnál, a pont fölötti felirat pedig megmondja, hogy ott a visszahívható görbe konvex vagy konkáv. A kijelzők mutatják a két árat, az opció értékét, a három hozamot, valamint az effektív durációt és konvexitást. Vidd a pontot 9%-ról 3%-ra, és figyeld, ahogy a sáv szélesedésével a felirat negatív konvexitásra vált. Ezután változtasd a visszahívási védelmet, és nézd, hogyan keskenyedik a sáv a védelem hosszabbodásával.

*[Interaktív ábra: callable price yield](https://quantsandbox.dev/hu/guide/fixed-income/callable-bonds)*

## Összefoglalás

- A visszahívható kötvény feljogosítja a kibocsátót, hogy a védelmi időszak után a visszahívási áron visszafizesse.
- Az ára a fix kötvény ára mínusz a kibocsátó call opciójának értéke; a tulajdonost magasabb hozam kárpótolja.
- A legrosszabb hozam, vagyis a lejáratig és a visszahívásig számított hozam közül az alacsonyabb, az óvatos jegyzési konvenció.
- A kuponráta körül és alatta az ár a visszahívási ár felé nyomódik össze: az effektív duráció csökken, a konvexitás negatívvá válik.

> A következő lecke, a „Hitelkockázat: csődvalószínűség és hitelfelár”, egy másik okot vizsgál, amiért egy kötvény kevesebbet fizethet az ígértnél: a kibocsátó esetleg egyáltalán nem fizet.

[Árazz kötvényeket, és hasonlítsd össze az ár–hozam görbéiket a Kötvényárazás laborban](https://quantsandbox.dev/hu/bond-pricing)

## Interaktív laborok

- [Kötvényárazó kalkulátor és ár–hozam görbe](https://quantsandbox.dev/hu/bond-pricing)
- [Binomiális opcióárazó fa kalkulátor](https://quantsandbox.dev/hu/binomial)

## Gyakorló kérdések

### 1. A piac hirtelen sokkal ingadozóbb kamatokra számít; a mai hozamok és minden más változatlan. Mi történik a visszahívható kötvény árával?

- a) Csökken, mert a kibocsátó visszahívási opciója értékesebb lesz.
- b) Nő, mert egy ingadozóbb kötvény többet ér.
- c) Változatlan, mert a hozam nem változott.
- d) A fix kötvény árához igazodik.

**Válasz:** a) Csökken, mert a kibocsátó visszahívási opciója értékesebb lesz.

A visszahívható kötvény a fix kötvény és a kibocsátónak eladott opció különbsége. A fix kötvény nem változik, az opció viszont többet ér, ha a jövő bizonytalanabb, így a tulajdonos számára az ár csökken.

### 2. 5%-os hozamnál a visszahívható kötvény effektív konvexitása körülbelül $-68$. A hozam 1 százalékponttal emelkedik vagy csökken. Egy azonos durációjú, nulla konvexitású kötvényhez képest a visszahívható kötvény…

- a) többet veszít hozamemelkedéskor, mint amennyit nyer hozamcsökkenéskor
- b) többet nyer hozamcsökkenéskor, mint amennyit veszít hozamemelkedéskor
- c) mindkét irányban pontosan a durációja szerint mozog
- d) a visszahívás miatt nem reagál a hozamváltozásra

**Válasz:** a) többet veszít hozamemelkedéskor, mint amennyit nyer hozamcsökkenéskor

Negatív konvexitásnál az árgörbe az érintője alatt fut, így a $\tfrac{1}{2}C_{\text{eff}}P(\Delta y)^2$ tag mindkét irányban levon. 5%-ról a lecke számai is mutatják: csökkenéskor $+4{,}09$, emelkedéskor $-4{,}75$.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/callable-bonds

Előző lecke: [Kamatswapok](https://quantsandbox.dev/hu/guide/fixed-income/interest-rate-swaps)

Következő lecke: [Hitelkockázat: csődvalószínűség és hitelfelár](https://quantsandbox.dev/hu/guide/fixed-income/credit-risk)
