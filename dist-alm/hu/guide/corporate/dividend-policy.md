# Osztalék, kifizetési politika és az osztalékdiszkont-modell

A Gordon-féle növekedési modell, növekedés a visszatartott nyereségből, a Modigliani–Miller-féle osztalékirrelevancia, és mikor számít mégis a kifizetés.

A részvény tulajdonosát megilletik a vállalat által kifizetendő osztalékok. Az értékelése tehát olyan diszkontálási feladat, amilyet a „Kamat, kamatozás és diszkontálás” megoldott, és egyenletes növekedés mellett az összeg az „Annuitások, örökjáradékok és hiteltörlesztés” növekvő örökjáradékává egyszerűsödik. Ez a lecke levezeti ezt a képletet, megmutatja, honnan jön a növekedés, és azt a kérdést teszi fel a kifizetésről, amelyet a „Tőkeszerkezet és a Modigliani–Miller-tételek” az adósságról: számít-e, hogy a vállalat a nyereségének mekkora részét fizeti ki?

## Osztalékok és az osztalékdiszkont-modell

Legyen $D_t$ a $t$-edik év végén várt egy részvényre jutó osztalék, $k$ pedig az ilyen kockázatú részvénytől elvárt hozam, a **sajáttőke-költség**. A mai ár az összes jövőbeli osztalék jelenértéke, ez az **osztalékdiszkont-modell**:

$$
P_0 = \sum_{t=1}^{\infty} \frac{D_t}{(1+k)^t}.
$$

A részvénynek nincs lejárata, ezért az összeg végtelen. Úgy tűnhet, hogy aki egy év múlva eladja a részvényt, az osztalékot és az eladási árat veszi meg, nem egy végtelen sort; csakhogy az eladási ár maga is a 2. évtől kezdődő osztalékok jelenértéke, így a két nézőpont ugyanazt adja.

## A Gordon-féle növekedési képlet

Ha az osztalékok állandó $g$ ütemben nőnek, vagyis $D_t = D_1 (1+g)^{t-1}$, az összeg növekvő örökjáradék. Ha $g < k$, akkor a **Gordon-féle növekedési képlethez** konvergál:

$$
P_0 = \frac{D_1}{k - g}.
$$

A képlet egyszerű, és $g = k$ közelében nagyon érzékeny: ahogy a növekedési ütem megközelíti a diszkontrátát, a nevező nullához tart, az ár pedig elszáll. Ha $g \ge k$, az összeg divergál, és a képletnek nincs értelme; egyetlen vállalat sem nőhet örökké gyorsabban a diszkontrátánál. Átrendezve $k = D_1/P_0 + g$: az elvárt hozam az osztalékhozam és a növekedési ütem összege.

## Növekedés a visszatartott nyereségből

A növekedés nem ingyenes. A vállalat úgy növeli a nyereségét, hogy egy részét visszaforgatja. Legyen $E_1$ a jövő évi egy részvényre jutó nyereség (EPS), $d$ a **kifizetési arány** (a nyereség osztalékként kifizetett hányada), $b = 1 - d$ pedig a **visszatartási arány**. Ha a visszatartott nyereséget **sajáttőke-arányos megtérüléssel** (ROE) fekteti be, a nyereség és az osztalék üteme

$$
g = b \cdot \text{ROE}, \qquad D_1 = d \cdot E_1, \qquad P_0 = \frac{d\,E_1}{k - b\,\text{ROE}}.
$$

Ez a mérlegelés lényege. A nagyobb visszatartás csökkenti a mai osztalékot, de növeli a növekedési ütemet. Hogy melyik hatás győz, csak azon múlik, hogyan viszonyul a ROE a $k$-hoz. Ha a vállalat többet keres a visszaforgatott pénzen, mint amit a részvényesek elvárnak, a visszatartás értéket teremt, és az ár a kifizetés csökkenésével nő. Ha kevesebbet, a visszatartás értéket rombol, és a részvényesek jobban járnának, ha megkapnák a pénzt.

*[Interaktív ábra: payout ddm](https://quantsandbox.dev/hu/guide/corporate/dividend-policy)*

Az ábra a Gordon-féle árat mutatja a kifizetési arány függvényében 5-ös EPS mellett, összehasonlításként a vízszintes $E_1/k$ vonallal. Az alapbeállításokon (ROE 12%, $k$ 10%, kifizetés 40%) a növekedési ütem 7,20%, az osztalék 2,00, az ár 71,43, a (lent definiált) PVGO pedig 21,43. Ha a ROE-t $k$ alá állítod, a görbe a másik irányba lejt; ha egyenlővé teszed vele, a görbe a vízszintes vonalra kerül. Azokat a pontokat, ahol $g \ge k$, az ábra kihagyja, a kijelzők pedig gondolatjelet mutatnak.

### Kidolgozott példa: Az alapbeállítású részvény árazása

1. Növekedés 60%-os visszatartásból 12%-os ROE mellett.
   $$g = 0{,}6 \times 0{,}12$$ → **0.072**
2. A jövő évi osztalék az 5-ös EPS 40%-os kifizetésével.
   $$D_1 = 0{,}4 \times 5$$ → **2**
3. A Gordon-féle ár.
   $$P_0 = \frac{2}{0{,}10 - 0{,}072}$$ → **71.43**
4. A növekedés nélküli érték: a teljes nyereség örökké kifizetve.
   $$\frac{E_1}{k} = \frac{5}{0{,}10}$$ → **50**
5. A növekedési lehetőségek jelenértéke.
   $$\text{PVGO} = 71{,}43 - 50$$ → **21.43**

## A kifizetés irrelevanciája

Most legyen a ROE egyenlő $k$-val. Az ár $d E_1 / (k - (1-d)k) = E_1/k$ minden kifizetési arányra: az ábrán a görbe a vízszintes vonalon fekszik. A pontosan az elvárt hozamon történő visszaforgatás nem teremt és nem is rombol értéket, így mindegy, hogyan oszlik meg a nyereség osztalék és visszaforgatás között.

Miller és Modigliani megmutatta, hogy ez sokkal általánosabban is igaz. Tökéletes tőkepiacon (nincs adó, tranzakciós költség, információs aszimmetria) és rögzített beruházási politika mellett a kifizetési politika nem befolyásolja a vállalat értékét. Az érv ugyanaz, mint a tőkeszerkezetnél: a befektetők bármely politikát maguk is visszacsinálhatnak. Aki több pénzt szeretne, mint amennyit a vállalat fizet, eladhat néhány részvényt, ez a **házi osztalék**; aki kevesebbet, az osztalékot újabb részvényekbe forgathatja. Mivel bárki ingyen előállíthatja a kívánt kifizetést, senki sem fizet többet egy adott politikáért.

Ugyanez az érvelés vonatkozik a **saját részvény visszavásárlására**. Ha a vállalat 100-at osztalékként fizet ki, vagy ugyanezzel részvényeket vásárol vissza, a részvényesek ugyanannyi készpénzt kapnak; az osztalék után minden tulajdonosnak ugyanannyi részvénye marad alacsonyabb áron, a visszavásárlás után kevesebb részvény marad változatlan áron. Tökéletes piacon a kettő egyenértékű.

## Amikor a kifizetés számít

**Adók.** Ahol az osztalékot magasabb adó terheli, mint az árfolyamnyereséget, vagy a nyereség adója az eladásig halasztható, az osztalékként kifizetett egy forint kevesebbet ér a részvényesnek, mint a visszavásárlással visszaadott. A különböző adóhelyzetek különböző befektetőket vonzanak a különböző politikákhoz, ez az úgynevezett klientúrahatás.

**Jelzés.** A vezetők többet tudnak a jövőbeli nyereségről, mint a külső befektetők. Mivel a vállalatok nem szívesen csökkentik az osztalékot, egy emelés költséges, ezért hihető jelzés arról, hogy a vezetés tartósnak várja a nyereséget, és az árak gyakran ennek megfelelően reagálnak az osztalékbejelentésekre.

**Ügynökprobléma.** A vállalatban hagyott készpénzt olyan projektekre is el lehet költeni, amelyek a vezetőket szolgálják, nem a részvényeseket. A kifizetés vállalása csökkenti ezt a kockázatot; ez az egyik oka, hogy a kevés jó projekttel rendelkező, érett vállalatok magas osztalékot fizetnek.

## A növekedési lehetőségek jelenértéke

A Gordon-féle ár felbontható a jelenlegi, örökké kifizetett nyereség értékére és a maradékra:

$$
P_0 = \frac{E_1}{k} + \text{PVGO}.
$$

A **növekedési lehetőségek jelenértéke** (PVGO) az ár azon része, amely a jövőbeli beruházásokból származik. Csak akkor pozitív, ha ezek a beruházások többet hoznak $k$-nál; nulla, ha a ROE egyenlő $k$-val, akármennyit forgat is vissza a vállalat; és negatív, ha a ROE $k$ alatt van, a vállalat mégis visszaforgat. A magas PVGO-jú részvény növekedési részvény, amelynek ára még meg nem valósított projekteken múlik.

> Az osztalékdiszkont-modell közvetlenül a saját tőkét értékeli. A pálya későbbi részén a diszkontált pénzáramos értékelés a teljes vállalatot értékeli a szabad pénzáramaiból, és a maradványértékhez ugyanezt a Gordon-képletet használja.

## Összefoglalás

- Az osztalékdiszkont-modell a részvényt az összes jövőbeli osztalék $k$ sajáttőke-költséggel számolt jelenértékeként árazza.
- Állandó $g < k$ növekedésnél a Gordon-képletre egyszerűsödik: $P_0 = D_1/(k - g)$.
- A növekedés a visszatartott nyereségből jön, $g = b \cdot \text{ROE}$; a visszatartás pontosan akkor emeli az árat, ha a ROE nagyobb $k$-nál.
- ROE = $k$ és tökéletes piac mellett a kifizetés irreleváns: a házi osztalék és a visszavásárlás bármely politikát visszacsinál.
- Az adók, a jelzés és az ügynökköltségek miatt számít a kifizetés a gyakorlatban.
- A PVGO $= P_0 - E_1/k$ a jövőbeli növekedés értéke; az alapbeállításokon a 71,43-as árból 21,43.

[Nyisd meg az Értékelés labort, és nézd meg a Gordon-képletet a maradványértékben](https://quantsandbox.dev/hu/valuation)

## Interaktív laborok

- [DCF-értékelés: szabad cash flow és terminális érték](https://quantsandbox.dev/hu/valuation)
- [Modigliani–Miller: tőkeszerkezet-vizualizáció](https://quantsandbox.dev/hu/capital-structure)

## Gyakorló kérdések

### 1. Az EPS 5, a sajáttőke-költség 10%. Mennyi a Gordon-féle ár, ha a vállalat a teljes nyereségét kifizeti (100%-os kifizetés)?

**Válasz:** 50

Teljes kifizetésnél semmit sem tart vissza, így $g = 0$ és $D_1 = 5$. Az ár $5 / 0{,}10 = 50$, a növekedés nélküli $E_1/k$ érték, a ROE-tól függetlenül.

### 2. A visszatartott nyereségből növekvő osztalékdiszkont-modellben mikor nincs hatása a kifizetési aránynak a részvényárra?

- a) Mindig, ha a ROE nagyobb a sajáttőke-költségnél
- b) Ha a ROE egyenlő a sajáttőke-költséggel, és a piacon nincsenek súrlódások
- c) Csak 100%-os kifizetési aránynál
- d) Soha: a nagyobb kifizetés mindig emeli az árat

**Válasz:** b) Ha a ROE egyenlő a sajáttőke-költséggel, és a piacon nincsenek súrlódások

ROE = $k$ esetén az ár minden kifizetésnél $E_1/k$, a Miller–Modigliani-érvhez pedig tökéletes piac kell (nincs adó, költség, információs rés), hogy a házi osztalék ingyenes legyen. Ha a ROE nagyobb $k$-nál, a visszatartás értéket ad; ha kisebb, értéket rombol.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/dividend-policy

Előző lecke: [Tőkeszerkezet és a Modigliani–Miller-tételek](https://quantsandbox.dev/hu/guide/corporate/capital-structure)

Következő lecke: [Diszkontált pénzáram alapú értékelés](https://quantsandbox.dev/hu/guide/corporate/dcf-valuation)
