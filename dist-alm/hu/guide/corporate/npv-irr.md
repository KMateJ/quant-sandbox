# Nettó jelenérték és belső megtérülési ráta

Projektpénzáramok, NPV, az NPV-profil, IRR, jövedelmezőségi index, és ahol az IRR félrevezet.

Egy vállalat folyamatosan dönt arról, mely projektekbe vágjon bele: új gépbe, új termékcsaládba, új üzembe. Minden projekt most pénzbe kerül, és később várhatóan pénzt hoz. Ez a lecke ezt az összevetést két számmá alakítja, a nettó jelenértékké és a belső megtérülési rátává, a „Kamat, kamatozás és diszkontálás” című lecke diszkontálására építve.

## Egy projekt pénzáramai

Egy projektet a **pénzáramaival** írunk le: azokkal az összegekkel, amelyeket adott időpontokban kifizet vagy behoz. Jelölje $CF_t$ a $t$-edik év végi nettó pénzáramot, ahol $t = 0$ a mai napot jelenti. Egy tipikus projektnek negatív a $CF_0$ (a beruházás), utána pedig pozitív $CF_1, \dots, CF_N$ pénzáramok következnek.

Két modellezési döntést hozunk. A pénzáramok minden év végén érkeznek, és a diszkontráta éves kamatozással értendő. Mindkettő a labor beállításaival egyezik.

## A diszkontráta

Ebben a leckében $r$ a projekt **diszkontrátája**: az az éves hozam, amelyet a befektetők máshol, azonos kockázatú befektetéssel elérhetnének. Más néven *alternatív tőkeköltség* vagy *elvárt hozam*. Ez nem kockázatmentes kamatláb; annál magasabb, mert a projekt pénzáramai bizonytalanok.

## Nettó jelenérték

Diszkontáljuk vissza minden pénzáramot a mai napra az $1/(1+r)^t$ éves diszkontfaktorral, és adjuk össze őket. Az eredmény a **nettó jelenérték** (NPV):

$$
\text{NPV}(r) = CF_0 + \frac{CF_1}{1+r} + \frac{CF_2}{(1+r)^2} + \cdots + \frac{CF_N}{(1+r)^N} = \sum_{t=0}^{N} \frac{CF_t}{(1+r)^t}.
$$

Az NPV az az érték, amelyet a projekt ma hozzátesz. A projekt jövőbeli pénzáramait a befektetők a piacon a jelenértékükért meg tudnák szerezni; a projekt ehelyett $-CF_0$ költségért adja őket. A különbség a tulajdonosok nyeresége (vagy vesztesége).

> NPV-szabály: fogadjuk el a projektet, ha $\text{NPV} > 0$. Egymást kizáró projektek közül a legnagyobb NPV-jűt válasszuk.

## Egyenlő éves pénzáramú projekt

Vegyünk egy projektet, amely ma 100-ba kerül, és a következő $N$ év mindegyikének végén ugyanakkora $C$ összeget fizet. A $t = 0$ utáni pénzáramok **annuitást** alkotnak, amelynek jelenértékére zárt képlet adható. A mértani sor összegzésével

$$
\sum_{t=1}^{N} \frac{C}{(1+r)^t} = C \cdot \frac{1 - (1+r)^{-N}}{r}, \qquad \text{NPV}(r) = -100 + C \cdot \frac{1 - (1+r)^{-N}}{r}.
$$

Példa: $C = 30$, $N = 5$ és $r = 10\%$.

### Kidolgozott példa: Egyenlő éves pénzáramú projekt NPV-je

1. Az annuitásfaktor: évi 1 egység $N$ éven át tartó kifizetésének jelenértéke.
   $$\frac{1 - (1+r)^{-N}}{r}$$ → **3.7908**
2. A beáramlások jelenértéke: $C$ szorozva az annuitásfaktorral.
   $$\text{PV} = C \cdot \frac{1 - (1+r)^{-N}}{r}$$ → **113.72**
3. Vonjuk le a beruházást, így kapjuk az NPV-t; pozitív, tehát a projekt értéket teremt.
   $$\text{NPV} = -100 + \text{PV}$$ → **13.72**

Ha $N = 4$, a beáramlások csak kb. $95{,}10$-et érnek, és az NPV $-4{,}90$.

## Az NPV-profil

Ábrázoljuk az NPV-t a diszkontráta függvényében. Ez a görbe az **NPV-profil**. $r = 0$ mellett a pénzáramok egyszerű összegével egyenlő (a példában $-100 + 5 \times 30 = 50$). Ahogy $r$ nő, a későbbi pénzáramokat egyre erősebben diszkontáljuk, és az NPV csökken. A példaprojektnél $5\%$-on $29{,}88$, $10\%$-on $13{,}72$, $15\%$-on $0{,}56$, $20\%$-on pedig $-10{,}28$.

## Belső megtérülési ráta

A **belső megtérülési ráta** (IRR) az a diszkontráta, amely mellett az NPV pontosan nulla:

$$
\sum_{t=0}^{N} \frac{CF_t}{(1+\text{IRR})^t} = 0.
$$

Ez az a pont, ahol az NPV-profil metszi a vízszintes tengelyt. Általános képlet nincs rá; numerikusan keressük meg, olyan rátákat próbálva, amelyek között az NPV előjelet vált, majd az intervallumot szűkítve. A példaprojekt IRR-je kb. $15{,}24\%$. Úgy olvassuk, mint azt az éves hozamot, amelyet maga a projekt termel a benne lekötött pénzen.

Ha egy projektnél egyetlen kiáramlást csak beáramlások követnek, a profil folyamatosan csökken, így az IRR-szabály egybevág az NPV-szabállyal: az NPV pontosan akkor pozitív, ha $r < \text{IRR}$.

Az ábra 0 és 40% közötti rátákra mutatja annak a projektnek az NPV-profilját, amely 100-ba kerül, és $N$ éven át évi $C$-t fizet. A csúszkák $C$-t, $N$-t és $r$-t állítják; a kijelzők az $r$-en vett NPV-t, az IRR-t és a pénzáramok diszkontálatlan összegét mutatják. Az alapbeállításokkal ($C = 25$, $N = 5$, $r = 10\%$) az NPV kb. $-5{,}23$, az IRR kb. $7{,}93\%$: a projekt értéket rombol. Növeld $C$-t, hosszabbítsd $N$-t vagy csökkentsd $r$-t, amíg az NPV át nem lép a nullán. Az $r$ mozgatása csak végigcsúszik a görbén, nem változtatja meg, ezért az IRR helyben marad.

*[Interaktív ábra: npv profile](https://quantsandbox.dev/hu/guide/corporate/npv-irr)*

## Jövedelmezőségi index

A **jövedelmezőségi index** a beáramlások jelenértékét osztja el a kezdő beruházással:

$$
\text{PI} = \frac{\sum_{t=1}^{N} CF_t/(1+r)^t}{-CF_0}.
$$

A példában $\text{PI} = 113{,}72/100 \approx 1{,}14$: minden befektetett egység 1,14 egységnyi jelenértéket hoz. A $\text{PI} > 1$ feltétel ugyanaz, mint az $\text{NPV} > 0$. Az index akkor hasznos, ha a tőke korlátozott, és a projekteket a befektetett egységre jutó érték szerint kell rangsorolni.

## Ahol az IRR félrevezet

Az IRR azért népszerű, mert egy százalékot könnyű kommunikálni, de két helyzetben rossz választ adhat.

**Egymást kizáró projektek.** Az A projekt 100-ba kerül, és egy év múlva 120-at hoz; a B projekt 100-ba kerül, és három év múlva 150-et hoz. Az A projekt IRR-je $20\%$, a B-é csak kb. $14{,}47\%$. $r = 10\%$ mellett viszont A nettó jelenértéke $120/1{,}1 - 100 \approx 9{,}09$, B-é pedig $150/1{,}1^3 - 100 \approx 12{,}70$. B több értéket teremt. A két profil kb. $11{,}80\%$-nál metszi egymást; ez alatt az NPV és az IRR szerinti sorrend ellentmond egymásnak, és az NPV szerinti a helyes, mert pénzben méri az értéket, nem százalékban.

**Többször előjelet váltó pénzáramok.** A $-100$, $+230$, $-132$ pénzáramú projekt NPV-je $10\%$-on és $20\%$-on is nulla. A profilja előbb emelkedik, majd csökken, így két IRR-je van, és egyik sem értelmes hozamráta. A tényleges diszkontrátán számolt NPV ilyenkor is megadja a választ.

A következő ábrán a pénzáramokat magunk építjük fel. Minden sötétebb oszlop egy év pénzárama a 0. évtől a 6. évig; fel vagy le húzva változtatható. A mögötte lévő halványabb oszlop a jelenértéke, $CF_t/(1+r)^t$ az $r$ ráta mellett, így látszik, mennyivel kevesebbet ér ma egy későbbi pénzáram. A kijelzők az $r$ melletti NPV-t, az IRR-t és a diszkontálatlan összeget mutatják. Az alapértelmezett pénzáramok a korábbi projektéi: most $-100$, utána öt éven át évi 25; az NPV $10\%$-on $-5{,}23$, az IRR $7{,}93\%$. Húzd most a 0. évet $-40$-re, a 6. évet $-100$-ra: ez egy olyan projekt, amelynek a végén helyreállítási költség merül fel. A pénzáramok kétszer váltanak előjelet, az NPV nagyjából $13{,}3\%$-on és $30{,}8\%$-on is nulla, és az IRR-kijelző jelzi, hogy több IRR lehetséges. Az NPV $r = 10\%$ mellett $-1{,}68$, $r = 20\%$ mellett $+1{,}28$: hogy megéri-e a projekt, a tényleges diszkontrátán múlik, és ezt csak az NPV veszi figyelembe.

*[Interaktív ábra: cashflow builder](https://quantsandbox.dev/hu/guide/corporate/npv-irr)*

## Összefoglalás

- Egy projekt időponthoz rendelt pénzáramok listája; mindegyiket a projekt $r$ diszkontrátájával diszkontálva és összeadva kapjuk az NPV-t.
- Fogadjuk el a pozitív NPV-jű projekteket; egymást kizáró alternatívák közül a legnagyobb NPV-jűt.
- Az IRR az a ráta, amelyen az NPV nulla, vagyis ahol az NPV-profil metszi a tengelyt.
- A jövedelmezőségi index a beáramlások befektetett egységre jutó jelenértéke; $\text{PI} > 1$ pontosan akkor, ha $\text{NPV} > 0$.
- Kizáró projektek rangsorolásánál és többször előjelet váltó pénzáramoknál az NPV-re hagyatkozzunk, ne az IRR-re.

> Egy későbbi lecke, „Súlyozott átlagos tőkeköltség”, azt az $r$ diszkontrátát becsli meg, amelyre minden NPV-számításnak szüksége van.

[Építs projekt-pénzáramokat, és vizsgáld az NPV-t, az IRR-t és az NPV-profilt az NPV és IRR laborban](https://quantsandbox.dev/hu/npv-irr)

## Interaktív laborok

- [NPV- és IRR-kalkulátor NPV-profillal](https://quantsandbox.dev/hu/npv-irr)

## Gyakorló kérdések

### 1. Egy projekt ma 100-ba kerül, egy év múlva nem fizet semmit, két év múlva pedig 121-et fizet. Mekkora az IRR-je?

**Válasz:** 10%

Az IRR a $-100 + 121/(1+\text{IRR})^2 = 0$ egyenlet megoldása, tehát $(1+\text{IRR})^2 = 1{,}21$ és $\text{IRR} = 10\%$: az a ráta, amelyen az NPV éppen nulla.

### 2. Két egymást kizáró projekt közül A-nak magasabb az IRR-je, B-nek viszont a vállalat diszkontrátáján magasabb az NPV-je. Melyiket válassza a vállalat?

- a) A-t, mert magasabb a százalékos hozama
- b) B-t, mert a tényleges diszkontrátán több értéket teremt
- c) Bármelyiket, hiszen mindkettő NPV-je pozitív
- d) Egyiket sem, amíg az IRR-ek meg nem egyeznek

**Válasz:** b) B-t, mert a tényleges diszkontrátán több értéket teremt

Az NPV pénzben méri az értéket azon a rátán, amellyel a vállalat valóban szembesül; az IRR százalékokat rangsorol, és figyelmen kívül hagyja a méretet és az időzítést. Ha a két rangsor eltér, az NPV a helyes.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/npv-irr

Előző lecke: [Annuitások, örökjáradékok és hiteltörlesztés](https://quantsandbox.dev/hu/guide/corporate/annuities)

Következő lecke: [Projektkockázat: érzékenység, forgatókönyvek és Monte Carlo NPV](https://quantsandbox.dev/hu/guide/corporate/capital-budgeting-risk)
