# Tőkeszerkezet és a Modigliani–Miller-tételek

Az MM I. és II. tétele adók nélkül, a kamatadópajzs, a tőkeáttételes saját tőke költsége és a WACC adóval.

A „Súlyozott átlagos tőkeköltség” című lecke adottnak vette a hitel és a saját tőke arányát. Egy vállalat ezt az arányt meg tudja változtatni: hitelt vehet fel és visszavásárolhat részvényeket, vagy részvényt bocsáthat ki és visszafizethet hitelt. Ez a lecke azt vizsgálja, változik-e ettől a vállalat értéke és a tőkeköltsége. Modigliani és Miller válasza: adók nélküli világban nem, társasági adó mellett viszont igen, a kamatadópajzson keresztül.

## Tőkeszerkezet és tőkeáttétel

A vállalat **tőkeszerkezete** az idegen tőke ($D$) és a saját tőke ($E$) aránya. Leírható az **eladósodottsági rátával**, $D/V$-vel, ahol $V = D + E$, vagy ezzel egyenértékűen a **hitel–saját tőke aránnyal**, $D/E$-vel. A kettő kapcsolata

$$
\frac{D}{E} = \frac{D/V}{1 - D/V}.
$$

A hitelt használó vállalat **tőkeáttételes**; ugyanez a vállalat hitel nélkül **tőkeáttétel nélküli**. Több hitel használata a **tőkeáttétel** növelése. A lecke során a vállalat működése, így a működési pénzáramai is változatlanok. Csak az változik, hogyan oszlanak meg ezek a pénzáramok a hitelezők és a részvényesek között.

## Feltevések

Modigliani és Miller idealizált piacon dolgozik. A feltevéseket érdemes kimondani, mert az alábbi következtetések mindegyike rajtuk múlik:

- Nincsenek adók (ezt a lecke később feloldja).
- Nincsenek csőd- vagy pénzügyi nehézségi költségek.
- A befektetők és a vállalatok ugyanazon a kamaton vehetnek fel és helyezhetnek ki pénzt.
- Mindenki ugyanazzal az információval rendelkezik, és nincsenek tranzakciós költségek.

## A vállalat értéke adók nélkül

Legyen $V_U$ a tőkeáttétel nélküli vállalat értéke, $V_L$ pedig ugyanannak a vállalatnak az értéke hitellel. A **Modigliani–Miller I. tétel** szerint adók nélkül

$$
V_L = V_U.
$$

Az érvelés arbitrázsmentességi érv. Aki a tőkeáttételes vállalat teljes hitelét és teljes saját tőkéjét birtokolja, pontosan a vállalat működési pénzáramait kapja, amelyek hitellel és hitel nélkül is ugyanazok. Két, ugyanazokra a pénzáramokra szóló követelés árának meg kell egyeznie. Az a részvényes, aki nagyobb tőkeáttételt szeretne, maga is felvehet hitelt, és vehet belőle több részvényt („házi tőkeáttétel”), így a vállalat nem teremthet értéket azzal, hogy helyette vesz fel hitelt.

Jó kép erre egy pizza: attól, hogy több vagy kevesebb szeletre vágjuk, nem lesz több vagy kevesebb pizza.

## A saját tőke költsége nő a tőkeáttétellel

Jelölje $r_U$ a tőkeáttétel nélküli vállalattól elvárt hozamot, a **tőkeáttétel nélküli tőkeköltséget**. Ez csak a működés üzleti kockázatát tükrözi. Mivel $V_L = V_U$, és a pénzáramok változatlanok, a teljes tőkeáttételes vállalat hozama továbbra is $r_U$, így (adók nélkül) a WACC-je $r_U$:

$$
r_U = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D.
$$

Szorozzunk $V/E$-vel, és fejezzük ki a saját tőke költségét, $r_E$-t:

$$
r_E = r_U\,\frac{V}{E} - r_D\,\frac{D}{E} = r_U\Big(1 + \frac{D}{E}\Big) - r_D\,\frac{D}{E} = r_U + (r_U - r_D)\,\frac{D}{E}.
$$

Ez a **Modigliani–Miller II. tétel**. A hitel olcsóbb a saját tőkénél, $r_D < r_U$, mégsem csökken a WACC, ha a vállalat több hitelt vesz fel: a részvényesek ugyanazt az üzleti kockázatot kisebb részesedésen viselik, ezért az elvárt hozamuk, $r_E$, éppen annyival nő, amennyi kiegyenlíti az olcsóbb hitelt.

Példa: $r_U = 10\%$, $r_D = 5\%$ és $D/V = 40\%$, így $D/E = 0{,}4/0{,}6 \approx 0{,}667$. Ekkor $r_E = 10\% + 5\% \times 0{,}667 \approx 13{,}33\%$, a WACC pedig $0{,}6 \times 13{,}33\% + 0{,}4 \times 5\% = 10\% = r_U$.

> Adók nélkül a tőkeszerkezet közömbös: $V_L = V_U$, a WACC minden eladósodottság mellett $r_U$, és $r_E = r_U + (r_U - r_D)\,D/E$.

## Társasági adó és kamatadópajzs

Vezessünk be egy $t$ társasági adókulcsot. Ahogy a „Súlyozott átlagos tőkeköltség” leckében, a kamat levonható, így egy $D$ hitellel, $r_D$ kamaton finanszírozott vállalat évente $t\,r_D D$ adót takarít meg. Tegyük fel, hogy a hitel **örökjáradék jellegű**: a vállalat a $D$ összeget örökké fenntartja. Az adómegtakarítás ekkor örökjáradék, és $r_D$-vel diszkontálva (ugyanolyan biztos, mint a kamatfizetések) megkapjuk az adópajzs értékét:

$$
\text{PV(adópajzs)} = \frac{t\,r_D D}{r_D} = t\,D, \qquad V_L = V_U + t\,D.
$$

Példa: egy $V_U = 1000$ értékű, tőkeáttétel nélküli vállalat, amely $t = 25\%$ mellett $D = 400$ hitelt vesz fel, $V_L = 1000 + 0{,}25 \times 400 = 1100$-at ér. A többlet 100 olyan pénz, amely már nem az adóhatósághoz kerül.

A tőkeköltségek képletei ennek megfelelően módosulnak. Örökjáradék jellegű hitel mellett

$$
r_E = r_U + (r_U - r_D)(1 - t)\,\frac{D}{E}, \qquad \text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D(1 - t) = r_U\Big(1 - t\,\frac{D}{V}\Big).
$$

A fenti számokkal ($r_U = 10\%$, $r_D = 5\%$, $D/V = 40\%$) és $t = 25\%$ mellett:

### Kidolgozott példa: Tőkeköltségek társasági adóval

1. Az eladósodottság $D/E$ alakban, $D/V$-ből.
   $$\frac{D}{E} = \frac{D/V}{1 - D/V}$$ → **0.667**
2. A II. tétel adóval: a saját tőke költsége.
   $$r_E = r_U + (r_U - r_D)(1 - t)\,\frac{D}{E}$$ → **12.5%**
3. Az adózás utáni hitelköltség.
   $$r_D\,(1 - t)$$ → **3.75%**
4. A WACC a súlyozott átlagból.
   $$\text{WACC} = \frac{E}{V}\,r_E + \frac{D}{V}\,r_D(1 - t)$$ → **9%**
5. A rövidebb képlet ugyanezt adja.
   $$r_U\Big(1 - t\,\frac{D}{V}\Big)$$ → **9%**

A WACC kisebb, mint $r_U = 10\%$, és most csökken, ahogy a tőkeáttétel nő.

A következő ábra sávokként rajzolja meg ezeket az értékeket egy $V_U = 100$ értékű, tőkeáttétel nélküli vállalatra. A felső sáv a tőkeáttétel nélküli, csak saját tőkéből finanszírozott vállalat. Az alsó ugyanez a vállalat hitellel, $D$ hitelre és $E$ saját tőkére bontva; a $V_U$-nál húzott szaggatott jelen túli sávozott rész a $t\,D$ adópajzs. Húzd a hitel és a saját tőke közötti határt (vagy fókuszálj rá, és használd a nyílbillentyűket), és állítsd $D/V$-t 0 és 80% közé; az alatta lévő sávok $r_E$-t, az adózás utáni hitelköltséget és a WACC-t mutatják az $r_U$-nál húzott szaggatott jelhez képest. $D/V = 40\%$ mellett a vállalat hitele $D \approx 44{,}4$, értéke $V_L \approx 111{,}1$, a kijelzők pedig ismét $12{,}5\%$-ot és $9\%$-ot mutatnak. Kapcsold az adót „Nincs” állásba: az alsó sáv akármennyi hitel mellett is ugyanolyan hosszú marad, mint a felső, ez az I. tétel, miközben $r_E$ tovább nő.

*[Interaktív ábra: capital split](https://quantsandbox.dev/hu/guide/corporate/capital-structure)*

## Tőkeköltségek a tőkeáttétel függvényében

Az ábra a $D/V$ eladósodottsági ráta függvényében, 0 és 80% között mutatja a saját tőke költségét ($r_E$), az adózás utáni hitelköltséget ($r_D(1 - t)$) és a WACC-t, az adót tartalmazó képletek szerint. A csúszkák $r_U$-t, $r_D$-t, a $t$ adókulcsot és a választott $D/V$ értéket állítják, ez utóbbit függőleges vonal jelöli; a kijelzők itt adják meg $r_E$-t, az adózás utáni hitelköltséget és a WACC-t. Az alapbeállításokkal ($r_U = 10\%$, $r_D = 5\%$, $t = 25\%$, $D/V = 40\%$) $12{,}5\%$-ot, $3{,}75\%$-ot és $9\%$-ot mutatnak, ahogy fent kiszámoltuk. Állítsd $t$-t nullára: a WACC vonala vízszintes lesz $r_U$ magasságában, ez az I. és II. tétel adók nélkül. Növeld $t$-t, és figyeld, hogy a WACC meredekebben lejt.

*[Interaktív ábra: wacc leverage](https://quantsandbox.dev/hu/guide/corporate/capital-structure)*

## Az eredmény korlátai

Szó szerint véve az adót is tartalmazó változat azt mondja, hogy a vállalatot szinte teljes egészében hitelből kellene finanszírozni. A valódi vállalatok nem így tesznek, mert nagy tőkeáttételnél a feltevések nem teljesülnek. Az erősen eladósodott vállalatok **pénzügyi nehézségi költségekkel** szembesülnek: drágább hitellel, elpártoló vevőkkel és beszállítókkal, csőd esetén jogi költségekkel. A tőkeszerkezet *átváltási (trade-off) elmélete* az adópajzsot ezekkel a költségekkel állítja szembe, ami egy mérsékelt eladósodottságot sugall, ahol a vállalat értéke a legnagyobb. Az ábra és a labor ennek a mérlegnek csak az adóoldalát mutatja.

## Összefoglalás

- A tőkeszerkezet a hitel és a saját tőke aránya, $D/V$-vel vagy $D/E$-vel mérve; a működési pénzáramok nem függnek tőle.
- Adók nélkül $V_L = V_U$, és a WACC bármilyen tőkeáttétel mellett a tőkeáttétel nélküli $r_U$ tőkeköltséggel egyenlő (I. tétel).
- A saját tőke költsége nő a tőkeáttétellel: $r_E = r_U + (r_U - r_D)\,D/E$ (II. tétel).
- Társasági adóval és örökjáradék jellegű hitellel $V_L = V_U + tD$, $r_E = r_U + (r_U - r_D)(1 - t)\,D/E$ és $\text{WACC} = r_U(1 - t\,D/V)$.
- A modellből kimaradó pénzügyi nehézségi költségek korlátozzák, mennyi hitelt érdemes felvenni.

> Egy későbbi lecke, „Diszkontált pénzáram alapú értékelés”, a WACC segítségével egy egész vállalatot értékel a szabad pénzáramaiból.

[Nézd meg, hogyan mozgatja a tőkeáttétel a saját tőke költségét, a WACC-t és a vállalat értékét a Tőkeszerkezet laborban](https://quantsandbox.dev/hu/capital-structure)

## Interaktív laborok

- [Modigliani–Miller: tőkeszerkezet-vizualizáció](https://quantsandbox.dev/hu/capital-structure)
- [WACC-kalkulátor: súlyozott átlagos tőkeköltség](https://quantsandbox.dev/hu/wacc)

## Gyakorló kérdések

### 1. Adók nélkül egy vállalatnál $r_U = 12\%$, a hitel kamata $r_D = 6\%$, és az eladósodottság $D/E = 1$. Mekkora hozamot várnak el a részvényesek?

**Válasz:** 18%

A II. tétel szerint $r_E = r_U + (r_U - r_D)\,D/E = 12\% + 6\% \times 1 = 18\%$. A WACC marad $0{,}5 \times 18\% + 0{,}5 \times 6\% = 12\% = r_U$.

### 2. Adóval a $V_L = V_U + t\,D$ érték az adóssággal folyamatosan nő. Miért nem vesznek fel mégis a valódi vállalatok szinte csak hitelt?

- a) Mert a kamatadópajzs nem nő tovább, ha az adósság meghaladja a vállalatérték felét.
- b) Mert a nagy adósság pénzügyi nehézségi költségekkel jár, amelyek meghaladják a további adópajzsot.
- c) Mert az I. tétel szerint az adósság értéket rombol.
- d) Mert az idegen tőke mindig drágább a saját tőkénél.

**Válasz:** b) Mert a nagy adósság pénzügyi nehézségi költségekkel jár, amelyek meghaladják a további adópajzsot.

A képlet nem számol a pénzügyi nehézségek költségeivel. Nagy tőkeáttételnél ezek a költségek (drágább hitel, elvesztett vevők, csődköltségek) gyorsabban nőnek, mint az adópajzs, ezért az átváltási elmélet szerint a legjobb eladósodottság mérsékelt.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/capital-structure

Előző lecke: [Súlyozott átlagos tőkeköltség](https://quantsandbox.dev/hu/guide/corporate/wacc)

Következő lecke: [Osztalék, kifizetési politika és az osztalékdiszkont-modell](https://quantsandbox.dev/hu/guide/corporate/dividend-policy)
