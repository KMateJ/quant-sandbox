# Immunizáció és durációillesztés

Kötelezettség védelme kamatmozgások ellen jelenérték és duráció illesztésével, és miért számít a konvexitás és az újrasúlyozás.

A „Duráció és konvexitás” című lecke azt mérte, mennyit mozdul egyetlen kötvény ára, ha megváltozik a hozama. Ez a lecke ebből a mérésből fedezést készít. Aki egy rögzített napon rögzített összeggel tartozik, olyan kötvényeket választhat, amelyek értéke együtt mozog a tartozás értékével, így a kamatlábak változása egyik oldalt sem sújtja jobban a másiknál. A jelölés ugyanaz, mint a „Kötvényárak és hozamok” című leckében: $F = 100$ névérték, éves kuponok, éves kamatozású hozamok, $D$ Macaulay-duráció és $C$ konvexitás. A hozamgörbe végig lapos, és párhuzamosan mozdul el.

## Egy rögzített kötelezettség

Egy nyugdíjpénztárnak pontosan 7 év múlva $L = 1\,000\,000$ összeget kell kifizetnie. Lapos, $y = 5\%$-os hozam mellett ennek a **kötelezettségnek** a jelenértéke

$$
PV_L = \frac{L}{(1+y)^{7}} = \frac{1\,000\,000}{1{,}05^{7}} \approx 710\,681.
$$

A kötelezettség egyetlen, kupon nélküli kifizetés, így a durációja a lejárata, $D_L = 7$, a konvexitása pedig $C_L = 7 \cdot 8/1{,}05^2 \approx 50{,}79$. A pénztár ma pontosan $PV_L$ értékű kötvényt tart. A kötvények értéke és $PV_L$ különbsége a **többlet**; a cél az, hogy ez kamatmozgáskor se legyen negatív.

## Árfolyamkockázat és újrabefektetési kockázat

A hozamok emelkedése két dolgot tesz egy $H$ évig tartott kötvényportfólióval. A kötvények piaci értéke azonnal csökken (**árfolyamkockázat**), viszont minden $H$ előtt kapott kupont a magasabb kamaton lehet újra befektetni (az **újrabefektetési kockázat** itt a tulajdonos javára dolgozik). A hozamok csökkenése fordított hatású. A ma $P(y)$ értékű portfólió értéke a $H$ időpontban $V_H = P(y)\,(1+y)^{H}$, és ennek hozamérzékenysége

$$
\frac{d \ln V_H}{dy} = \frac{P'(y)}{P(y)} + \frac{H}{1+y} = \frac{H - D}{1+y},
$$

ahol felhasználtuk az előző lecke $P'/P = -D/(1+y)$ összefüggését. Ha a tartási idő megegyezik a durációval, $H = D$, a két hatás elsőrendben kioltja egymást: egy kis párhuzamos eltolódás nem változtat a horizontbeli értéken.

## A jelenérték és a duráció illesztése

Ebből adódik az **immunizáció** receptje. Olyan eszközöket kell választani, amelyekre

$$
PV_A = PV_L \qquad \text{és} \qquad D_A = D_L,
$$

ahol $D_A$ a kötvények durációinak értékkel súlyozott átlaga. Két kötvénnyel, egy $D_S$ durációjú rövid és egy $D_{Lg}$ durációjú hosszú kötvénnyel, a pénz $w$ hányadát a rövid, $1 - w$ hányadát a hosszú kötvénybe tesszük. A $w\,D_S + (1-w)\,D_{Lg} = D_L$ feltételből

$$
w = \frac{D_{Lg} - D_L}{D_{Lg} - D_S}.
$$

> Immunizáció: a kötelezettséggel azonos jelenértékű és azonos durációjú eszközöket kell tartani. Ekkor egy kis párhuzamos hozameltolódás mindkét értéket ugyanannyival változtatja.

## Számpélda

Vegyünk egy kétéves és egy tizenkét éves, egyaránt 5%-os kuponú kötvényt; $y = 5\%$ mellett mindkettő névértéken forog. A durációk $D_S \approx 1{,}952$ és $D_{Lg} \approx 9{,}306$, így

$$
w = \frac{9{,}306 - 7}{9{,}306 - 1{,}952} \approx 0{,}3136.
$$

A pénztár 222 888 értékben vesz a kétéves és 487 793 értékben a tizenkét éves kötvényből, összesen 710 681 értékben, és az eszközök durációja pontosan 7. Most toljuk el az összes hozamot ugyanannyival, és árazzunk újra mindent:

- $\Delta y = -1\%$: az eszközök és a kötelezettség is nagyjából 49 200-zal nő; a többlet $+747$.
- $\Delta y = +1\%$: mindkettő nagyjából 45 600-zal csökken; a többlet $+642$.
- $\Delta y = \pm 3\%$: a többlet $+7\,861$, illetve $+4\,985$.

Vessük össze a két fedezetlen változattal. Ha minden a kétéves kötvényben van, 1%-os hozamcsökkenés 35 832-es hiányt okoz, mert a kötvény alig drágul, a kötelezettség viszont erősen nő. Ha minden a tizenkét éves kötvényben van, 1%-os emelkedés után 13 958 a hiány.

Ugyanez a két kötvény más kötelezettséget is immunizálhat. Legyen 500 000 esedékes 5 év múlva, továbbra is 5%-os lapos hozamgörbe mellett.

### Kidolgozott példa: Ötéves kötelezettség immunizálása a 2 és a 12 éves kötvénnyel

1. A kötelezettség jelenértéke.
   $$PV_L = \frac{500\,000}{1{,}05^{5}}$$ → **391763**
2. A 2 éves kötvénybe fektetett hányad, $D_S \approx 1{,}952$ és $D_{Lg} \approx 9{,}306$ mellett.
   $$w = \frac{D_{Lg} - D_L}{D_{Lg} - D_S}$$ → **0.5856**
3. A 2 éves kötvénybe fektetett összeg.
   $$w \cdot PV_L$$ → **229411**
4. A 12 éves kötvénybe fektetett összeg.
   $$(1 - w) \cdot PV_L$$ → **162352**

Rövidebb kötelezettséghez több rövid kötvény kell: a pénz 59%-a a korábbi 31% helyett.

## Miért marad pozitív a többlet

A durációillesztés eltünteti a többlet elsőrendű tagját. A másodrendű tag a konvexitások különbségéből adódik:

$$
\Delta S \approx \tfrac{1}{2}\,(C_A - C_L)\,PV_L\,(\Delta y)^2.
$$

Egy rövid és egy hosszú kötvényből álló **súlyzóportfólió** a pénzáramait a kötelezettség időpontja köré teríti, ezért nagyobb a konvexitása, mint egyetlen hetedik évi kifizetésé: itt $C_A \approx 70{,}27$, szemben a $C_L \approx 50{,}79$-cel. A képlet 1%-os elmozdulásra mindkét irányban nagyjából 692-es többletet ad, közel a pontos 747-hez és 642-höz. Amíg $C_A \ge C_L$, minden kis párhuzamos eltolódás nemnegatív többletet hagy. A védelem azonban csak ennyit ér: ha a rövid és a hosszú hozamok eltérően mozognak, a súlyzó veszíthet.

## Újrasúlyozás

Az immunizált pozíció magától nem marad immunizált. Ha a hozamok nem változnak, minden duráció évente egy évvel rövidül, és az illesztés megmarad. Ha viszont a hozamok elmozdulnak, a két kötvény durációja eltérő mértékben változik, a kötelezettségé pedig nem: 1%-os emelkedés után az eszközök durációja 6,796, 1%-os csökkenés után 7,205, miközben $D_L = 7$ mindkét esetben. A pénztárnak újra ki kell számolnia $w$-t, és kereskedéssel vissza kell állítania a célsúlyt; a gyakorlatban ezt időszakonként teszi, nem folyamatosan.

Az ábrán a portfólió a kezdetben rögzített névértékeket tartja. Húzd a sokk jelölőjét a sávon, vagy használd a nyílbillentyűket, és told el az összes hozamot legfeljebb 300 bázisponttal bármelyik irányba. A két sáv az eszközök és a kötelezettség jelenértékét mutatja, a kijelzők a többletet és a két durációt. Alatta a kis grafikon a többletet ábrázolja a sokk függvényében; a már bejárt szakaszok kiemelve látszanak. Durációillesztett portfóliónál a görbe lapos U alakú, és sosem megy nulla alá. Válts a „Csak a rövid kötvény” vagy a „Csak a hosszú kötvény” beállításra, és ugyanaz a húzás az egyik oldalon hiányt nyit.

*[Interaktív ábra: immunization shock](https://quantsandbox.dev/hu/guide/fixed-income/immunization)*

## Összefoglalás

- Egy rögzített kötelezettség kupon nélküli kifizetés: a durációja a lejárata.
- A durációval egyenlő horizonton az árfolyamkockázat és az újrabefektetési kockázat elsőrendben kioltja egymást.
- Az immunizáció a jelenértéket és a durációt illeszti; két kötvénnyel a súly a $w\,D_S + (1-w)\,D_{Lg} = D_L$ egyenletből adódik.
- Ha az eszközök konvexitása legalább akkora, mint a kötelezettségé, a kis párhuzamos eltolódások nemnegatív többletet hagynak; a nem párhuzamos mozgások ellen nem véd.
- A hozamok mozgásával a durációk elcsúsznak, ezért a pozíciót újra kell súlyozni.

> A következő lecke, az „Azonnali kamatok, forward kamatok és a hozamgörbe”, elhagyja a lapos görbét, és lejáratonként eltérő hozamokat enged meg; éppen ez az, ami ellen a párhuzamos eltolódásra épülő immunizáció nem véd.

[Próbáld ki az Immunizációs laborban](https://quantsandbox.dev/hu/immunization)

## Interaktív laborok

- [Immunizáció: durációillesztés kötvényekkel](https://quantsandbox.dev/hu/immunization)
- [Kötvény durációja és konvexitása: közelítések](https://quantsandbox.dev/hu/duration-convexity)
- [Kötvényárazó kalkulátor és ár–hozam görbe](https://quantsandbox.dev/hu/bond-pricing)

## Gyakorló kérdések

### 1. Egy kötelezettség durációja 7. Egy 2-es durációjú rövid és egy 10-es durációjú hosszú kötvénnyel immunizálod. A pénz hányad részét fekteted a rövid kötvénybe? A választ százalékban add meg.

**Válasz:** 37.5%

A $w\,D_S + (1 - w)\,D_{Lg} = D_L$ feltételből $w = (10 - 7)/(10 - 2) = 0{,}375$. Minél közelebb van a kötelezettség durációja a hosszú kötvényéhez, annál kevesebb kerül a rövidbe.

### 2. Egy durációra illesztett súlyzóportfólió konvexitása nagyobb a kötelezettségénél ($C_A > C_L$). A hozamok kicsit, párhuzamosan elmozdulnak. Mi történik a többlettel?

- a) Kissé pozitív lesz, akár emelkednek, akár csökkennek a hozamok.
- b) Pontosan nulla marad, mert a durációk egyeznek.
- c) Hozamcsökkenéskor pozitív, hozamemelkedéskor negatív lesz.
- d) Mindkét irányban negatív lesz.

**Válasz:** a) Kissé pozitív lesz, akár emelkednek, akár csökkennek a hozamok.

A durációillesztés eltünteti az elsőrendű tagot; ami marad, az $\tfrac{1}{2}(C_A - C_L)\,PV_L\,(\Delta y)^2$, ez $C_A > C_L$ esetén $\Delta y$ bármely előjelére pozitív.

---

Forrás: https://quantsandbox.dev/hu/guide/fixed-income/immunization

Előző lecke: [Duráció és konvexitás](https://quantsandbox.dev/hu/guide/fixed-income/duration-convexity)

Következő lecke: [Azonnali kamatok, forward kamatok és a hozamgörbe](https://quantsandbox.dev/hu/guide/fixed-income/yield-curve)
