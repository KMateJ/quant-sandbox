# Projektkockázat: érzékenység, forgatókönyvek és Monte Carlo NPV

Mely inputok mozgatják leginkább az NPV-t, fedezeti értékek, forgatókönyv-elemzés és az NPV szimulált eloszlása.

A „Nettó jelenérték és belső megtérülési ráta” egy projektet egyetlen számmá alakított: diszkontáld a pénzáramokat $r$ rátával, vond le a beruházást, és fogadd el, ha az eredmény pozitív. A számítás minden bemenete azonban előrejelzés. Ez a lecke azt kérdezi, mennyit mozdul az NPV, ha az előrejelzések tévednek, és az egyetlen számból előbb egy sávot, majd egy eloszlást csinál. Az egyenletes pénzáramokat az „Annuitások, örökjáradékok és hiteltörlesztés” annuitásfaktorával értékeljük.

## Egy szám elrejti a kockázatot

Vegyünk egy projektet, amely ma 1000-be kerül, és 5 évig fut. Évente 100 egységet ad el 15-ös áron, egységenként 8 változó költséggel és 200 fix költséggel. A diszkontráta 8%. Az éves pénzáram

$$
CF = Q\,(P - c) - F = 100 \times (15 - 8) - 200 = 500,
$$

és mivel minden évben ugyanannyi, a jelenértéke a pénzáram szorozva az 5 éves annuitásfaktorral:

$$
NPV = CF \cdot \frac{1 - (1+r)^{-T}}{r} - I = 500 \times 3{,}9927 - 1000 = 996{,}36.
$$

A közel 1000-es pozitív NPV megnyugtatónak tűnik. De a 100 egység és a 15-ös ár egy még nem létező piacra vonatkozó becslés. Két azonos NPV-jű projekt nagyon különbözhet abban, mekkora eséllyel veszít pénzt, és erről az egyetlen szám semmit sem mond. Az alábbi eszközök, egyre több munkával, ezt a bizonytalanságot írják le.

## Érzékenységvizsgálat

Az **érzékenységvizsgálat** egyszerre egy bemenetet változtat, a többit az alapértéken tartja, és feljegyzi az NPV-t. Gyakori konvenció minden bemenetre ±10%, így az eredmények összevethetők. A fenti projektre:

- Eladott mennyiség (90 / 110): NPV 716,87 / 1275,84.
- Ár (13,50 / 16,50): NPV 397,45 / 1595,26.
- Egységköltség (7,20 / 8,80): NPV 1315,77 / 676,94.
- Fix költség (180 / 220): NPV 1076,21 / 916,50.
- Beruházás (900 / 1100): NPV 1096,36 / 896,36.
- Diszkontráta (7,2% / 8,8%): NPV 1039,17 / 954,96.

Messze az ár a legfontosabb bemenet: 10%-os árváltozás az egységnyi fedezetet 7-ről 5,50-re vagy 8,50-re viszi, ez a fedezet 21%-os változása, és az NPV mindkét irányban nagyjából 600-zal mozdul. A diszkontráta itt számít a legkevésbé. Ha a bemeneteket a sávjuk szélessége szerint sorba rendezed (ezt gyakran **tornádódiagramként** rajzolják), látod, hol érdemes jobb előrejelzésre energiát fordítani.

### Kidolgozott példa: Az alap NPV és az eladott mennyiség 10%-os változása

1. Az éves pénzáram az alapesetben.
   $$100 \times (15 - 8) - 200$$ → **500**
2. Az 5 éves annuitásfaktor 8%-on.
   $$\frac{1 - 1{,}08^{-5}}{0{,}08}$$ → **3.9927**
3. Az alap NPV.
   $$500 \times 3{,}9927 - 1000$$ → **996.36**
4. A pénzáram 10%-kal kevesebb (90) egységgel.
   $$90 \times 7 - 200$$ → **430**
5. Az NPV 90 egységgel.
   $$430 \times 3{,}9927 - 1000$$ → **716.87**
6. Az NPV 110 egységgel.
   $$570 \times 3{,}9927 - 1000$$ → **1275.84**

## Fedezetipont-elemzés

Az érzékenység azt kérdezi, mennyit mozdul az NPV; a **fedezetipont-elemzés** azt, hogy meddig mozdulhat egy bemenet, mielőtt az NPV nullára csökken. Mivel itt az NPV lineáris az eladott mennyiségben, a fedezeti pont kézzel is megkapható: a projektnek $1000 / 3{,}9927 = 250{,}46$ éves pénzáram kell, tehát

$$
Q^{*}\,(15 - 8) - 200 = 250{,}46 \quad\Rightarrow\quad Q^{*} = \frac{450{,}46}{7} = 64{,}35.
$$

Az eladások több mint egyharmadával csökkenhetnek, mielőtt a projekt értéket rombol. Ugyanígy a fedezeti ár 12,50 (17%-kal az alap alatt), a fedezeti egységköltség 10,50 (31%-kal felette). A nemlineárisan belépő bemenetekre, például a diszkontrátára, a fedezeti pontot numerikusan keressük; a rátára ez éppen az IRR. Ha a fedezeti pont közel van az alapértékhez, az figyelmeztetés: egy mérsékelt előrejelzési hiba is megfordítja a döntést.

## Forgatókönyv-elemzés

A bemenetek ritkán mozognak egyenként. A gyenge piac általában kevesebb eladott egységet és alacsonyabb árat is jelent. A **forgatókönyv-elemzés** több bemenetet egy következetes történetbe rendezve mozgat együtt. Ha a legjobb eset 120 egység 16,50-es áron, a legrosszabb 80 egység 13,50-es áron (minden más az alapon), akkor az NPV a legjobb esetben 2274,02, az alapesetben 996,36, a legrosszabban −41,75. Az együttes mozgás sokkal nagyobb, mint bármelyik egybemenetes sáv, és a legrosszabb eset már veszteség.

A forgatókönyveket könnyű elmagyarázni a döntéshozónak, de csak három pontot mutatnak. Nem mondják meg, mennyire valószínű a legrosszabb eset, és már a „legrosszabb” kiválasztása is mérlegelés kérdése.

## Monte Carlo-szimuláció

A **Monte Carlo-szimuláció** minden bizonytalan bemenetet valószínűségi eloszlással helyettesít, sok együttes mintát húz, és mindegyikre kiszámítja az NPV-t. Az eredmény az NPV-k teljes eloszlása. Az ábrán az eladott mennyiség normális 100 várható értékkel és 20 szórással, az ár normális 15 várható értékkel és 1,5 szórással (mindkettő nullánál csonkolva), a többi bemenet rögzített. A szórás ugyanaz a szóródási mérték, mint a „Hozamok és volatilitás” leckében; itt azt méri, mennyire tévedhet egy előrejelzés.

*[Interaktív ábra: npv distribution](https://quantsandbox.dev/hu/guide/corporate/capital-budgeting-risk)*

Az alapbeállításokon 5000 rögzített magú húzással az alapeseti NPV 996,36, a szimulált NPV-k átlaga 993,77 (a bemenetek majdnem lineárisan lépnek be, így az átlag a mintavételi zajtól eltekintve az alapeset közelében marad), a negatív NPV valószínűsége 11,0%, az 5. percentilis pedig −271,85. Ha mindkét szórást nullára állítod, a hisztogram egyetlen oszloppá zsugorodik 996,36-nál; ha növeled őket, a nulla jelölőtől balra eső tömeg nő.

> A szimuláció csak annyira jó, amennyire a bemeneti eloszlásai. Itt a mennyiséget és az árat egymástól függetlenül húzzuk; a gyakorlatban gyakran korrelálnak (a magas ár csökkentheti az eladásokat), és ennek elhanyagolása túl szélessé vagy túl szűkké teheti a szóródást.

## Mit kezdjünk az eloszlással

A szimulált NPV átlaga továbbra is az a szám, amelyet nullával vetünk össze, ha a vállalat diverzifikált, és az $r$ ráta már beárazza a projekt kockázatát. Ha $r$-rel diszkontálunk, majd a szóródásért még egyszer büntetünk, a kockázatot kétszer számoljuk. Az eloszlás olyan információt ad, amit az átlag nem: a **veszteség valószínűségét**, egy rossz kimenet méretét (az 5. percentilis, ugyanaz a gondolat, mint a kockáztatott érték) és azt, hogy mely bemenetek okozzák a veszteségkockázatot. Ez gyakorlati döntéseket irányít: érdemes-e próbaüzemmel tanulni a keresletről a teljes beruházás előtt, érdemes-e fix áras szerződéssel kiiktatni az árkockázatot, és túléli-e egyáltalán a vállalat a rossz kimeneteket.

E döntések némelyike maga is értékes: a várakozás, a bővítés vagy a kiszállás joga, miután a bizonytalanság feloldódik, annál többet ér, minél szélesebb az eloszlás. Erről szól a reálopciókról szóló lecke a pálya későbbi részében.

## Összefoglalás

- Egyetlen NPV elrejti, mennyire bizonytalanok a bemenetei; ugyanaz az NPV nagyon különböző kockázatot hordozhat.
- Az érzékenységvizsgálat egyszerre egy bemenetet mozgat (például ±10%-kal), és a bemeneteket az NPV-re gyakorolt hatásuk szerint rangsorolja.
- A fedezetipont-elemzés megkeresi azt a bemeneti értéket, amelynél az NPV nulla; az alapprojektnél ez évi 64,35 egység.
- A forgatókönyv-elemzés több bemenetet együtt mozgat legjobb, alap- és legrosszabb esetbe.
- A Monte Carlo-szimuláció a teljes NPV-eloszlást adja: az átlagát, a veszteség valószínűségét és az alsó percentiliseket.

[Nyisd meg az NPV és IRR labort, és futtass érzékenységeket és forgatókönyveket a saját pénzáramaidra](https://quantsandbox.dev/hu/npv-irr)

## Interaktív laborok

- [NPV- és IRR-kalkulátor NPV-profillal](https://quantsandbox.dev/hu/npv-irr)
- [Monte Carlo-opcióárazó szimulátor](https://quantsandbox.dev/hu/monte-carlo)

## Gyakorló kérdések

### 1. Mit változtat az érzékenységvizsgálat egy-egy lépésben?

- a) Minden bemenetet együtt, a legjobb vagy legrosszabb irányba
- b) Egyetlen bemenetet, a többit az alapértéken tartva
- c) Csak a diszkontrátát
- d) Minden bemenet véletlen húzását

**Válasz:** b) Egyetlen bemenetet, a többit az alapértéken tartva

Az érzékenységvizsgálat egyszerre egy bemenetet mozgat, a többit az alapesetben hagyja, így minden NPV-változás annak a bemenetnek tulajdonítható. A bemenetek együttes mozgatása a forgatókönyv-elemzés, a véletlen húzás a Monte Carlo-szimuláció.

### 2. Ha minden más bemenet az alapértékén van, évente hány egységet kell eladnia a projektnek, hogy az NPV nulla legyen?

**Válasz:** 64.35 egység

A szükséges éves pénzáram $1000 / 3{,}9927 = 250{,}46$. A fix költséget hozzáadva 450,46 fedezet kell, ezt az egységnyi 7-es fedezettel osztva 64,35 egység adódik.

---

Forrás: https://quantsandbox.dev/hu/guide/corporate/capital-budgeting-risk

Előző lecke: [Nettó jelenérték és belső megtérülési ráta](https://quantsandbox.dev/hu/guide/corporate/npv-irr)

Következő lecke: [Súlyozott átlagos tőkeköltség](https://quantsandbox.dev/hu/guide/corporate/wacc)
